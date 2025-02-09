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
		setCustomPrompt("")
	}
	
	const generatePrompt = async (image) => {
		if (!image || !customPrompt) {
			throw new Error("Please provide both an image and a prompt")
		}
		
		setIsGeneratingPrompt(true)
		setError(null)
		setChatContext(null)
		
		try {
			const data = await promptApi.generatePrompt(image, customPrompt)
			if (data.success) {
				setCurrentPrompt(data.prompt)
				setChatContext(data.context)
			} else {
				throw new Error(data.error || "Prompt generation failed")
			}
		} catch (err) {
			setError(err.message)
			throw err
		} finally {
			setIsGeneratingPrompt(false)
		}
	}
	
	const regeneratePrompt = async () => {
		setIsGeneratingPrompt(true)
		setError(null)
		
		try {
			const data = await promptApi.regeneratePrompt(chatContext, userPrompt)
			if (data.success) {
				setCurrentPrompt(data.prompt)
				setChatContext(data.context)
			} else {
				throw new Error(data.error || "Prompt regeneration failed")
			}
		} catch (err) {
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