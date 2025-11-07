// API Testing Configuration
// Based on old dashboard pattern

export interface InputField {
  type: 'string' | 'number' | 'file' | 'email' | 'url' | 'date' | 'boolean'
  required: boolean
  description?: string
  example: string | number | boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
}

export interface ApiEndpoint {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  credit: number
  endpoint: string
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  contentType: 'application/json' | 'multipart/form-data'
  category: 'Identity Verification' | 'Business Verification' | 'Document Verification' | 'Data Linkage' | 'DigiLocker' | 'Vehicle Verification'
  sampleInput: Record<string, InputField>
  sampleOutput: Record<string, any> | string
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'pan-verification',
    name: 'PAN Verification',
    shortDescription: 'Verify PAN card details',
    longDescription: 'Verify PAN card details and get the full name, date of birth, gender, and category of the PAN holder.',
    credit: 10,
    endpoint: '/verify/pan_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'Valid PAN number (use a real PAN for testing)',
        example: 'ABCDE1234F',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      client_id: 'CLI123456',
      pan_number: 'ABCDE1234F',
      full_name: 'JOHN DOE',
      dob: '01/01/1990',
      gender: 'Male',
      category: 'Individual'
    }
  },
  {
    id: 'bank-verification',
    name: 'Bank Account Verification',
    shortDescription: 'Verify bank account details',
    longDescription: 'Verify bank account details using account number and IFSC code.',
    credit: 10,
    endpoint: '/verify/bank_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      account_number: {
        type: 'string',
        required: true,
        description: 'Bank account number (use a real account for testing)',
        example: '50100012345678'
      },
      ifsc_code: {
        type: 'string',
        required: true,
        description: 'Bank IFSC code',
        example: 'HDFC0000123',
        validation: {
          minLength: 11,
          maxLength: 11
        }
      }
    },
    sampleOutput: {
      status: 'success',
      result: {
        name_at_bank: 'JOHN DOE',
        bank_name: 'HDFC BANK',
        account_status: 'Active',
        account_type: 'Savings'
      }
    }
  },
  {
    id: 'bank-verification-pennyless',
    name: 'Bank Verification (Pennyless)',
    shortDescription: 'Verify bank account without penny drop',
    longDescription: 'Verify bank account details using account number and IFSC code without penny drop.',
    credit: 10,
    endpoint: '/verify/bank_verification/pennyless',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      account_number: {
        type: 'string',
        required: true,
        description: 'Bank account number (use a real account for testing)',
        example: '50100012345678'
      },
      ifsc_code: {
        type: 'string',
        required: true,
        description: 'Bank IFSC code',
        example: 'HDFC0000123'
      }
    },
    sampleOutput: {
      status: 'success',
      beneficiary_name: 'JOHN DOE',
      beneficiary_account: '50100012345678',
      beneficiary_ifsc: 'HDFC0000123',
      bank_name: 'HDFC BANK',
      branch_name: 'Mumbai Main Branch'
    }
  },
  {
    id: 'gst-verification',
    name: 'GST Verification',
    shortDescription: 'Verify GST details',
    longDescription: 'Verify GST number and get business details.',
    credit: 10,
    endpoint: '/verify/gst_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      gst_number: {
        type: 'string',
        required: true,
        description: 'GST number',
        example: '29AABCU9603R1ZZ',
        validation: {
          minLength: 15,
          maxLength: 15
        }
      },
      filing_status: {
        type: 'string',
        required: true,
        description: 'Filing status to check',
        example: 'Active'
      }
    },
    sampleOutput: {
      status: 'success',
      gst_number: '29AABCU9603R1ZZ',
      trade_name: 'ABC COMPANY',
      registration_date: '01/07/2017',
      filing_status: 'Active'
    }
  },
  {
    id: 'uan-verification',
    name: 'UAN Verification',
    shortDescription: 'Verify UAN details',
    longDescription: 'Verify Universal Account Number and get employee details.',
    credit: 10,
    endpoint: '/verify/uan_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      uan_number: {
        type: 'string',
        required: true,
        description: 'UAN number',
        example: '123456789012',
        validation: {
          minLength: 12,
          maxLength: 12
        }
      }
    },
    sampleOutput: {
      status: 'success',
      uan_number: '123456789012',
      name: 'JOHN DOE',
      employee_details: {
        pf_number: 'PF123456',
        date_of_joining: '01/01/2020'
      }
    }
  },
  {
    id: 'voter-verification',
    name: 'Voter ID Verification',
    shortDescription: 'Verify voter ID details',
    longDescription: 'Verify voter ID and get voter details.',
    credit: 10,
    endpoint: '/verify/voter_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      voter_id: {
        type: 'string',
        required: true,
        description: 'Voter ID number (use a real voter ID for testing)',
        example: 'ABC1234567'
      }
    },
    sampleOutput: {
      status: 'success',
      voter_id: 'ABC1234567',
      name: 'JOHN DOE',
      constituency: 'Mumbai North'
    }
  },
  {
    id: 'driving-licence',
    name: 'Driving Licence Verification',
    shortDescription: 'Verify driving licence',
    longDescription: 'Verify driving licence details using licence number and date of birth.',
    credit: 10,
    endpoint: '/verify/driving_licence',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      licence_number: {
        type: 'string',
        required: true,
        description: 'Driving licence number (use a real DL for testing)',
        example: 'DL1420110012345'
      },
      dob: {
        type: 'date',
        required: true,
        description: 'Date of birth (DD/MM/YYYY)',
        example: '01/01/1990'
      }
    },
    sampleOutput: {
      status: 'success',
      licence_number: 'DL1420110012345',
      name: 'JOHN DOE',
      validity: '01/01/2030'
    }
  },
  {
    id: 'passport',
    name: 'Passport Verification',
    shortDescription: 'Verify passport details',
    longDescription: 'Verify passport details using passport number and date of birth.',
    credit: 10,
    endpoint: '/verify/passport',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      passport_number: {
        type: 'string',
        required: true,
        description: 'Passport number (use a real passport number for testing)',
        example: 'A1234567'
      },
      dob: {
        type: 'date',
        required: true,
        description: 'Date of birth (DD/MM/YYYY)',
        example: '01/01/1990'
      }
    },
    sampleOutput: {
      status: 'success',
      passport_number: 'A1234567',
      name: 'JOHN DOE',
      validity: '01/01/2030'
    }
  },
  {
    id: 'face-match',
    name: 'Face Match',
    shortDescription: 'Match two face images',
    longDescription: 'Compare two face images and get match score.',
    credit: 10,
    endpoint: '/verify/face_match',
    method: 'POST',
    contentType: 'multipart/form-data',
    category: 'Document Verification',
    sampleInput: {
      image1: {
        type: 'file',
        required: true,
        description: 'First face image',
        example: 'image1.jpg'
      },
      image2_url: {
        type: 'url',
        required: true,
        description: 'URL of second face image',
        example: 'https://example.com/image2.jpg'
      }
    },
    sampleOutput: {
      status: 'success',
      match_score: 95.5,
      result: 'Match',
      confidence: 'High',
      message: 'Faces match with 95.5% confidence'
    }
  },
  {
    id: 'ocr',
    name: 'OCR',
    shortDescription: 'Extract text from documents',
    longDescription: 'Extract text and data from document images using OCR.',
    credit: 10,
    endpoint: '/verify/ocr',
    method: 'POST',
    contentType: 'multipart/form-data',
    category: 'Document Verification',
    sampleInput: {
      file: {
        type: 'file',
        required: true,
        description: 'Document image file',
        example: 'document.jpg'
      },
      type: {
        type: 'string',
        required: true,
        description: 'Document type (pan, aadhaar, passport, etc.)',
        example: 'pan'
      }
    },
    sampleOutput: {
      status: 'success',
      data: {
        text: 'Extracted text',
        confidence: 98.5,
        document_type: 'PAN',
        extracted_fields: {
          pan_number: 'ABCDE1234F',
          name: 'JOHN DOE'
        }
      }
    }
  },
  {
    id: 'name-match',
    name: 'Name Match',
    shortDescription: 'Match two names',
    longDescription: 'Compare two names and get match score.',
    credit: 10,
    endpoint: '/verify/name_match',
    method: 'POST',
    contentType: 'application/json',
    category: 'Document Verification',
    sampleInput: {
      name_1: {
        type: 'string',
        required: true,
        description: 'First name',
        example: 'John Doe'
      },
      name_2: {
        type: 'string',
        required: true,
        description: 'Second name',
        example: 'JOHN DOE'
      }
    },
    sampleOutput: {
      status: 'success',
      client_id: 'CLI123456',
      name_1: 'John Doe',
      name_2: 'JOHN DOE',
      match_score: 95.0,
      match_status: 'Match'
    }
  },
  {
    id: 'mobile-to-pan',
    name: 'Mobile To PAN',
    shortDescription: 'Get PAN from mobile number',
    longDescription: 'Get PAN number associated with a mobile number.',
    credit: 10,
    endpoint: '/verify/mobile_to_pan',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      mobile: {
        type: 'string',
        required: true,
        description: 'Mobile number',
        example: '9876543210',
        validation: {
          minLength: 10,
          maxLength: 10
        }
      }
    },
    sampleOutput: {
      status: 'success',
      mobile_number: '9876543210',
      pan_number: 'ABCDE1234F',
      name: 'JOHN DOE'
    }
  }
]

// Get API by ID
export const getApiById = (id: string): ApiEndpoint | undefined => {
  return API_ENDPOINTS.find(api => api.id === id)
}

// Get all API IDs
export const getAllApiIds = (): string[] => {
  return API_ENDPOINTS.map(api => api.id)
}

// Get all unique categories
export const getAllCategories = (): string[] => {
  const categories = [...new Set(API_ENDPOINTS.map(api => api.category))]
  return ['All', ...categories.sort()]
}

// Get APIs by category
export const getApisByCategory = (category: string): ApiEndpoint[] => {
  if (category === 'All') return API_ENDPOINTS
  return API_ENDPOINTS.filter(api => api.category === category)
}

// Get all unique content types
export const getAllContentTypes = (): string[] => {
  const types = [...new Set(API_ENDPOINTS.map(api => api.contentType))]
  return ['All', ...types.sort()]
}
