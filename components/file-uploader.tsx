"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

type FileType = "csv" | "excel" | "sheets" | "url"

interface FileUploaderProps {
  onFileUploaded?: (file: File | string, fileType: FileType) => void
}

export function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<FileType | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedFileTypes = [
    ".csv",
    ".xls",
    ".xlsx",
    ".xlsm", // Excel files
    ".gsheet", // Google Sheets
  ]

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const determineFileType = (file: File): FileType | null => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (extension === "csv") return "csv"
    if (["xls", "xlsx", "xlsm"].includes(extension || "")) return "excel"
    if (extension === "gsheet") return "sheets"

    return null
  }

  const validateFile = (file: File): boolean => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`

    if (!allowedFileTypes.includes(extension)) {
      setErrorMessage(`Tipo de archivo no permitido. Por favor sube un archivo CSV, Excel o Google Sheets.`)
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrorMessage("El archivo es demasiado grande. El tamaño máximo es 10MB.")
      return false
    }

    return true
  }

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      setUploadStatus("error")
      return
    }

    const detectedFileType = determineFileType(file)

    if (!detectedFileType) {
      setErrorMessage("Formato de archivo no reconocido.")
      setUploadStatus("error")
      return
    }

    setFile(file)
    setFileType(detectedFileType)
    setUploadStatus("uploading")

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploadStatus("success")
        if (onFileUploaded) {
          onFileUploaded(file, detectedFileType)
        }
      }
    }, 100)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setUploadStatus("idle")
    setErrorMessage("")

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus("idle")
    setErrorMessage("")

    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedFileTypes.join(",")}
        className="hidden"
      />

      {uploadStatus === "error" && (
        <Alert variant="destructive" className="mb-3 text-xs sm:text-sm sm:mb-4 bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertTitle className="text-xs sm:text-sm">Error</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === "success" && (
        <Alert className="mb-3 border-green-200 text-green-700 text-xs sm:text-sm sm:mb-4 bg-green-50">
          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertTitle className="text-xs sm:text-sm">Archivo cargado con éxito</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            {file?.name} ({fileType === "csv" ? "CSV" : fileType === "excel" ? "Excel" : "Google Sheets"})
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === "uploading" && (
        <div className="mb-3 space-y-1 sm:space-y-2 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium">Cargando {file?.name}</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1 sm:h-2 bg-gray-200">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
          </Progress>
        </div>
      )}

      <Card
        className={`border-2 border-dashed p-3 text-center sm:p-4 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        } ${uploadStatus === "success" ? "border-green-500 bg-green-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
          <div className={`rounded-full p-1 sm:p-2 ${uploadStatus === "success" ? "bg-green-100" : "bg-blue-100"}`}>
            {uploadStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-6 sm:w-6" />
            ) : (
              <Upload className="h-4 w-4 text-blue-600 sm:h-6 sm:w-6" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-medium sm:text-sm text-gray-800">
              {uploadStatus === "success" ? "Archivo cargado correctamente" : "Arrastra y suelta un archivo"}
            </h3>

            {uploadStatus !== "success" && (
              <p className="text-[10px] text-gray-500 sm:text-xs">CSV, Excel o Google Sheets</p>
            )}
          </div>

          {uploadStatus !== "success" && (
            <Button
              variant="outline"
              onClick={handleButtonClick}
              className="mt-1 text-xs sm:text-sm sm:mt-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              disabled={uploadStatus === "uploading"}
              size="sm"
            >
              <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              Seleccionar archivo
            </Button>
          )}

          {uploadStatus === "success" && (
            <Button
              variant="outline"
              onClick={handleButtonClick}
              className="mt-1 text-xs sm:text-sm sm:mt-2 border-green-300 text-green-700 hover:bg-green-50"
              size="sm"
            >
              <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              Cambiar archivo
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

