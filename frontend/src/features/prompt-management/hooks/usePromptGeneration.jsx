import { useState } from 'react'
import { promptApi } from '../api/promptApi'

export const usePromptGeneration = () => {
	const [currentPrompt, setCurrentPrompt] = useState("")
	const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
	const [error, setError] = useState(null)
	const [chatContext, setChatContext] = useState(null)
	const [userPrompt, setUserPrompt] = useState("")
	const [customPrompt, setCustomPrompt] = useState("")
	
	
	const reset = () => {
		setCurrentPrompt("")
		setError(null)
		setChatContext(null)
		setUserPrompt("")
	}
	
	const replaceCompanyName = (prompt, companyName) => {
		if (!companyName) return prompt;
		return prompt.replace(/XYZ/g, companyName);
	}
	
	const generatePrompt = async (image, contextSize, companyName) => {
		if (!image || !customPrompt) {
			throw new Error("Please provide both an image and a prompt")
		}
		
		setIsGeneratingPrompt(true)
		setError(null)
		setChatContext(null)
		
		try {
			const processedPrompt = replaceCompanyName(customPrompt, companyName)
			
			const response = await promptApi.generatePrompt(image, processedPrompt)
			
			if (response.success) {
				setCurrentPrompt(response.data.prompt)
				setChatContext(response.data.context)
			} else {
				throw new Error(response.error || "Prompt generation failed")
			}
		} catch (err) {
			console.error('Generate prompt error:', err)
			setError(err.message)
			throw err
		} finally {
			setIsGeneratingPrompt(false)
		}
	}
	
	const regeneratePrompt = async (userPrompt, contextSize, companyName) => {
		setIsGeneratingPrompt(true)
		setError(null)
		
		try {
			const processedUserPrompt = replaceCompanyName(userPrompt, companyName)
			
			const response = await promptApi.regeneratePrompt(chatContext, processedUserPrompt)
			
			if (response.success) {
				setCurrentPrompt(response.data.prompt)
				setChatContext(response.data.context)
			} else {
				throw new Error(response.error || "Prompt regeneration failed")
			}
		} catch (err) {
			console.error('Regenerate prompt error:', err)
			setError(err.message)
			throw err
		} finally {
			setIsGeneratingPrompt(false)
		}
	}
	
	return {
		currentPrompt,
		isGeneratingPrompt,
		error,
		userPrompt,
		setUserPrompt,
		customPrompt,
		setCustomPrompt,
		generatePrompt,
		regeneratePrompt,
		reset
	}
}