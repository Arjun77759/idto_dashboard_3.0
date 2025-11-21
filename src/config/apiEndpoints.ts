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
    id: 'pan_verification',
    name: 'PAN Verification',
    shortDescription: 'Verify PAN card details and retrieve associated information including full name, date of birth, gender, and category.',
    longDescription: 'Verify PAN card details and retrieve comprehensive associated information including full name, date of birth, gender, and category. This service validates the authenticity of PAN cards issued by the Income Tax Department of India and provides detailed information about the cardholder. The verification process checks the PAN number format, validates its existence in the government database, and returns accurate personal details linked to the PAN card.',
    credit: 10,
    endpoint: '/verify/pan_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The PAN number to be verified.',
        example: 'ABCDE1234F',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      client_id: 'mock-client-987f6543-e21a-34b5-c678-901234567890',
      pan_number: 'ABCDE1234F',
      full_name: 'JOHN DOE SHARMA',
      dob: '15/08/1990',
      gender: 'Male',
      category: 'person',
      status: 'success'
    }
  },
  {
    id: 'bank_verification',
    name: 'Bank Account Verification',
    shortDescription: 'Verify bank account details including account holder name, bank information, and account status validation.',
    longDescription: 'Verify bank account details including comprehensive account holder name verification, detailed bank information, and thorough account status validation. This service performs a complete bank account verification by validating the account number and IFSC code against the bank\'s database, retrieving account holder information, bank details including branch information, MICR code, and performing name matching algorithms. The verification includes checking account status, ensuring the account is active and accessible, and providing detailed IFSC information including bank name, branch address, city, state, and other relevant banking details.',
    credit: 10,
    endpoint: '/verify/bank_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      account_number: {
        type: 'string',
        required: true,
        description: 'The bank account number to be verified.',
        example: '50100012345678',
        validation: {
          minLength: 10,
          maxLength: 16,
          pattern: '^[0-9]{10,16}$'
        }
      },
      ifsc_code: {
        type: 'string',
        required: true,
        description: 'The IFSC (Indian Financial System Code) of the bank.',
        example: 'HDFC0000123',
        validation: {
          minLength: 11,
          maxLength: 11,
          pattern: '^[A-Z]{4}[0-9]{7}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      result: {
        reference_id: 2024567890,
        name_at_bank: 'Mr JOHN DOE SHARMA',
        bank_name: 'HDFC BANK LIMITED',
        utr: '987654321098',
        city: 'MUMBAI',
        branch: 'ANDHERI WEST',
        micr: 400240067,
        name_match_score: '100',
        name_match_result: 'FULL_MATCH',
        account_status: 'VALID',
        account_status_code: 'ACCOUNT_IS_VALID',
        ifsc_details: {
          bank: 'HDFC BANK LIMITED',
          ifsc: 'HDFC0000123',
          micr: 400240067,
          nbin: null,
          address: 'GROUND FLOOR, SHOP NO 1 TO 4, BUILDING NO 1, VERSOVA LINK ROAD, ANDHERI WEST, MUMBAI 400053',
          city: 'MUMBAI',
          state: 'MAHARASHTRA',
          branch: 'ANDHERI WEST',
          ifsc_subcode: 'HDFC0',
          category: 'URBAN',
          swift_code: 'HDFCINBB'
        }
      }
    }
  },
  {
    id: 'bank_verification_pennyless',
    name: 'Bank Verification (Pennyless)',
    shortDescription: 'Verify bank account details without performing a penny drop transaction. Quick verification of account holder name and bank details.',
    longDescription: 'Verify bank account details without performing a penny drop transaction, providing quick and efficient verification of account holder name and comprehensive bank details. This pennyless verification method offers a faster alternative to traditional bank verification by eliminating the need for actual monetary transactions. The service validates account numbers and IFSC codes against bank databases, retrieves beneficiary information, confirms bank and branch details, and ensures account validity without the delay and complexity associated with penny drop verification methods. This approach is ideal for businesses requiring rapid account validation while maintaining accuracy and reliability.',
    credit: 10,
    endpoint: '/verify/bank_verification/pennyless',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      account_number: {
        type: 'string',
        required: true,
        description: 'The bank account number to be verified.',
        example: '50100012345678',
        validation: {
          minLength: 10,
          maxLength: 16,
          pattern: '^[0-9]{10,16}$'
        }
      },
      ifsc_code: {
        type: 'string',
        required: true,
        description: 'The IFSC (Indian Financial System Code) of the bank.',
        example: 'HDFC0000123',
        validation: {
          minLength: 11,
          maxLength: 11,
          pattern: '^[A-Z]{4}[0-9]{7}$'
        }
      }
    },
    sampleOutput: {
      beneficiary_name: 'Mr JOHN DOE SHARMA',
      beneficiary_account: '50100012345678',
      beneficiary_ifsc: 'HDFC0000123',
      bank_name: 'HDFC BANK LIMITED',
      branch_name: 'ANDHERI WEST',
      status: 'success'
    }
  },
  {
    id: 'cin_mca_verification',
    name: 'Cin Mca',
    shortDescription: 'Verify Corporate Identity Number (CIN) and retrieve company details from MCA database.',
    longDescription: 'Verify Corporate Identity Number (CIN) and retrieve comprehensive company details from the Ministry of Corporate Affairs (MCA) database. This service validates company registration information, including company name, registration date, status, authorized capital, and director details.',
    credit: 10,
    endpoint: '/verify/cin_mca_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      id_number: {
        type: 'string',
        required: true,
        description: 'The Corporate Identity Number (CIN) to be verified.',
        example: 'U12345AB2023PTC098765'
      }
    },
    sampleOutput: {
      client_id: 'company_ABCxyz123456789',
      company_id: 'U12345AB2023PTC098765',
      company_type: 'Company',
      company_name: 'EXAMPLE TECHNOLOGIES PRIVATE LIMITED',
      details: {
        company_info: {
          cin: 'U12345AB2023PTC098765',
          roc_code: 'RoC-Mumbai',
          registration_number: '098765',
          company_category: 'Company limited by Shares',
          class_of_company: 'Private',
          company_sub_category: 'Non-govt company',
          authorized_capital: '500000',
          paid_up_capital: '250000',
          number_of_members: '3',
          date_of_incorporation: '2023-05-15',
          registered_address: '123 BUSINESS TOWER, MAIN STREET, SECTOR 15, EXAMPLE CITY AB 400001 IN',
          address_other_than_ro: '-',
          email_id: 'info@exampletech.com',
          listed_status: 'Unlisted',
          active_compliance: null,
          suspended_at_stock_exchange: '-',
          last_agm_date: '1800-01-01',
          last_bs_date: '1800-01-01',
          company_status: 'Active',
          status_under_cirp: null
        },
        directors: [
          {
            din_number: '01234567',
            director_name: 'JOHN DOE SMITH',
            start_date: '2023-05-15',
            end_date: '1800-01-01',
            surrendered_din: null
          },
          {
            din_number: '08765432',
            director_name: 'JANE MARY JOHNSON',
            start_date: '2023-05-15',
            end_date: '1800-01-01',
            surrendered_din: null
          }
        ],
        charges: []
      },
      status: 'success'
    }
  },
  {
    id: 'gst_verification',
    name: 'Gst',
    shortDescription: 'Verify GST number and retrieve business details including trade name, registration status, and address information.',
    longDescription: 'Verify Goods and Services Tax (GST) number and retrieve comprehensive business details including trade name, registration status, address information, and business constitution. This service validates GST registration with the tax authorities and provides detailed information about the registered business entity.',
    credit: 10,
    endpoint: '/verify/gst_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      gst_number: {
        type: 'string',
        required: true,
        description: 'The GST number to be verified.',
        example: '29AABCU9603R1ZZ',
        validation: {
          minLength: 15,
          maxLength: 15,
          pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z]{1}[0-9]{3}[A-Z]{1}$'
        }
      },
      filing_status: {
        type: 'string',
        required: false,
        description: 'The filing status to check for the GST number.',
        example: 'Active'
      }
    },
    sampleOutput: {
      status: 'success',
      gst_number: '29AABCU9603R1ZZ',
      trade_name: 'ABC PRIVATE LIMITED',
      registration_date: '01/07/2017',
      filing_status: 'Active'
    }
  },
  {
    id: 'gst_verification_basic',
    name: 'Gst Verification Basic',
    shortDescription: 'Basic GST verification service with essential business details and registration status.',
    longDescription: 'Basic GST verification service providing essential business details and registration status. This streamlined service offers core GST validation features for quick business verification without comprehensive details.',
    credit: 10,
    endpoint: '/verify/gst_verification_basic',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      gst_number: {
        type: 'string',
        required: true,
        description: 'The GST number to be verified.',
        example: '29AABCU9603R1ZZ',
        validation: {
          minLength: 15,
          maxLength: 15,
          pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z]{1}[0-9]{3}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      gst_number: '29AABCU9603R1ZZ',
      trade_name: 'ABC PRIVATE LIMITED',
      legal_name: 'ABC PRIVATE LIMITED',
      registration_date: '2020-01-15',
      constitution_of_business: 'Private Limited Company',
      taxpayer_type: 'Regular',
      last_updated: '2024-01-15T10:30:00Z',
      principal_place_of_business: {
        address: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    }
  },
  {
    id: 'gst_advance',
    name: 'Gst Advance',
    shortDescription: 'Advanced GST verification with comprehensive business details, filing history, and compliance status.',
    longDescription: 'Advanced GST verification service providing comprehensive business details, filing history, and compliance status. This enhanced service offers detailed insights into GST registration including return filing patterns, compliance scores, and business analytics.',
    credit: 10,
    endpoint: '/verify/gst_advance',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      gst_number: {
        type: 'string',
        required: true,
        description: 'The GST number to be verified.',
        example: '29AABCU9603R1ZZ',
        validation: {
          minLength: 15,
          maxLength: 15,
          pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z]{1}[0-9]{3}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      gst_number: '29AABCU9603R1ZZ',
      trade_name: 'ABC PRIVATE LIMITED',
      legal_name: 'ABC PRIVATE LIMITED',
      registration_date: '2020-01-15',
      constitution_of_business: 'Private Limited Company',
      taxpayer_type: 'Regular',
      last_updated: '2024-01-15T10:30:00Z',
      principal_place_of_business: {
        address: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      comprehensive_details: {
        aadhaar_validation: 'Yes',
        aadhaar_validation_date: '2020-01-15',
        annual_aggregate_turnover: '500000000',
        center_jurisdiction: 'MUMBAI CENTRAL',
        constitution_of_business: 'Private Limited Company',
        core_business_activity_code: '74999',
        core_business_activity_description: 'Other professional, scientific and technical activities',
        date_of_cancellation: null,
        date_of_registration: '2020-01-15',
        gross_total_income: '450000000',
        gross_total_income_financial_year: '2023-24'
      },
      filing_history: [
        {
          return_period: '032024',
          filing_date: '2024-04-20',
          status: 'Filed',
          return_type: 'GSTR1'
        },
        {
          return_period: '022024',
          filing_date: '2024-03-20',
          status: 'Filed',
          return_type: 'GSTR1'
        }
      ],
      compliance_score: 95,
      hsn_info: [
        {
          hsn_code: '84',
          hsn_description: 'Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof'
        }
      ]
    }
  },
  {
    id: 'uan_verification',
    name: 'Verify Uan',
    shortDescription: 'Verify Universal Account Number (UAN) and retrieve employee details from EPFO database.',
    longDescription: 'Verify Universal Account Number (UAN) and retrieve employee details from the Employees\' Provident Fund Organisation (EPFO) database. This service validates UAN registration and provides information about the employee\'s PF account status and employment history.',
    credit: 10,
    endpoint: '/verify/uan_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      uan_number: {
        type: 'string',
        required: true,
        description: 'The Universal Account Number (UAN) to be verified.',
        example: '123456789012',
        validation: {
          minLength: 12,
          maxLength: 12,
          pattern: '^[0-9]{12}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      uan_number: '123456789012',
      name: 'JOHN DOE',
      employee_details: {
        date_of_birth: '01/01/1990',
        gender: 'Male',
        mobile: '9876543210',
        email: 'john.doe@example.com'
      }
    }
  },
  {
    id: 'face_match',
    name: 'Face Match',
    shortDescription: 'Compare two facial images and provide similarity score to verify identity through biometric matching.',
    longDescription: 'Compare two facial images using advanced biometric matching algorithms and provide a similarity score to verify identity. This service analyzes facial features, performs liveness detection, and provides confidence scores for identity verification purposes.',
    credit: 10,
    endpoint: '/verify/face_match',
    method: 'POST',
    contentType: 'multipart/form-data',
    category: 'Document Verification',
    sampleInput: {
      image1: {
        type: 'file',
        required: true,
        description: 'The first facial image for comparison (PNG, JPG, JPEG formats supported). You can upload a file or use the camera to capture a photo directly.',
        example: 'avatar.png'
      },
      image2_url: {
        type: 'string',
        required: true,
        description: 'URL of the second facial image for comparison.',
        example: 'https://example.com/image2.jpg'
      }
    },
    sampleOutput: {
      status: 'success',
      match_score: 85.7,
      result: 'MATCH',
      confidence: 'HIGH',
      message: 'Face match verification completed successfully'
    }
  },
  {
    id: 'ocr',
    name: 'OCR',
    shortDescription: 'Extract text and data from document images using Optical Character Recognition technology.',
    longDescription: 'Extract text and structured data from document images using advanced Optical Character Recognition (OCR) technology. This service processes various Indian identity documents including PAN cards, Aadhaar cards, passports, driving licenses, voter IDs, and vehicle registration certificates. The OCR engine provides high-accuracy text extraction with confidence scores and structured field mapping for verification purposes.',
    credit: 10,
    endpoint: '/verify/ocr',
    method: 'POST',
    contentType: 'multipart/form-data',
    category: 'Document Verification',
    sampleInput: {
      file: {
        type: 'file',
        required: true,
        description: 'The document image file to be processed (JPEG, PNG, JPG formats supported).',
        example: 'pan_card.jpg'
      },
      type: {
        type: 'string',
        required: true,
        description: 'Type of document to process. Supported types: pan, aadhaar, passport, driving_licence, voter, vehicle_rc',
        example: 'pan',
        validation: {
          pattern: '^(pan|aadhaar|passport|driving_licence|voter|vehicle_rc)$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      data: {
        text: 'Extracted text from document',
        confidence: 0.95,
        document_type: 'pan',
        extracted_fields: {
          pan_number: 'ABCDE1234F',
          name: 'JOHN DOE',
          father_name: 'FATHER DOE',
          dob: '01/01/1990'
        }
      }
    }
  },
  {
    id: 'name_match',
    name: 'Name Match',
    shortDescription: 'Compare two names and provide similarity score for identity verification and fuzzy matching.',
    longDescription: 'Compare two names using advanced string matching algorithms and provide a similarity score for identity verification purposes. This service handles variations in names, nicknames, and provides fuzzy matching capabilities for accurate name verification.',
    credit: 10,
    endpoint: '/verify/name_match',
    method: 'POST',
    contentType: 'application/json',
    category: 'Document Verification',
    sampleInput: {
      name_1: {
        type: 'string',
        required: true,
        description: 'The first name to compare.',
        example: 'Rajesh Kumar Sharma'
      },
      name_2: {
        type: 'string',
        required: true,
        description: 'The second name to compare.',
        example: 'Rajesh K Sharma'
      }
    },
    sampleOutput: {
      status: 'success',
      client_id: 'name_compare_YjyRwafxkaWkLstgiapV',
      name_1: 'Rajesh Kumar Sharma',
      name_2: 'Rajesh K Sharma',
      match_score: 100,
      match_status: true
    }
  },
  {
    id: 'voter_verification',
    name: 'Voter',
    shortDescription: 'Verify voter ID details and retrieve voter information from electoral database.',
    longDescription: 'Verify voter ID details and retrieve comprehensive voter information from the electoral database. This service validates voter registration status and provides information about the voter\'s constituency and registration details.',
    credit: 10,
    endpoint: '/verify/voter_verification',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      voter_id: {
        type: 'string',
        required: true,
        description: 'The voter ID to be verified.',
        example: 'ABC1234567'
      }
    },
    sampleOutput: {
      status: 'success',
      voter_id: 'ABC1234567',
      name: 'JOHN DOE',
      constituency: 'Sample Constituency'
    }
  },
  {
    id: 'driving_licence',
    name: 'Driving Licence',
    shortDescription: 'Verify driving license details and retrieve license holder information from transport authority database.',
    longDescription: 'Verify driving license details and retrieve comprehensive license holder information from the transport authority database. This service validates driving license authenticity and provides information about license validity, vehicle classes, and holder details.',
    credit: 10,
    endpoint: '/verify/driving_licence',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      licence_number: {
        type: 'string',
        required: true,
        description: 'The driving license number to be verified.',
        example: 'DL1420110012345'
      },
      dob: {
        type: 'string',
        required: true,
        description: 'Date of birth of the license holder.',
        example: '01/01/1990'
      }
    },
    sampleOutput: {
      status: 'success',
      licence_number: 'DL1420110012345',
      name: 'JOHN DOE',
      validity: '31/12/2025'
    }
  },
  {
    id: 'passport',
    name: 'Passport',
    shortDescription: 'Verify passport details and retrieve passport holder information from passport database.',
    longDescription: 'Verify passport details and retrieve comprehensive passport holder information from the passport database. This service validates passport authenticity and provides information about passport validity, place of issue, and holder details.',
    credit: 10,
    endpoint: '/verify/passport',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      passport_number: {
        type: 'string',
        required: true,
        description: 'The passport number to be verified.',
        example: 'A1234567'
      },
      dob: {
        type: 'string',
        required: true,
        description: 'Date of birth of the passport holder.',
        example: '01/01/1990'
      }
    },
    sampleOutput: {
      status: 'success',
      passport_number: 'A1234567',
      name: 'JOHN DOE',
      validity: '31/12/2030'
    }
  },
  {
    id: 'pan_all_in_one',
    name: 'Pan All In One',
    shortDescription: 'Comprehensive PAN verification with enhanced details and cross-verification capabilities.',
    longDescription: 'Comprehensive PAN verification service with enhanced details and cross-verification capabilities. This service provides complete PAN information along with linked details from multiple government databases for thorough identity verification.',
    credit: 10,
    endpoint: '/verify/pan_all_in_one',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The PAN number to be verified.',
        example: 'ABCDE1234F',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      pan_number: 'ABCDE1234F',
      full_name: 'JOHN DOE SHARMA',
      full_name_split: ['JOHN', 'DOE', 'SHARMA'],
      masked_aadhaar: 'XXXXXXXX1234',
      address: {
        line_1: '123 Sample Street',
        line_2: 'Sample Area',
        street_name: 'Sample Locality',
        zip: '400001',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'INDIA',
        full: '123 Sample Street Sample Area Sample Locality Mumbai Maharashtra INDIA 400001'
      },
      email: 'jo**************34@gmail.com',
      tax: true,
      phone_number: '98XXXXXX10',
      gender: 'M',
      dob: '1990-08-15',
      aadhaar_linked: true,
      category: 'person',
      less_info: false,
      is_director: {
        found: 'No',
        info: []
      },
      is_sole_proprietor: {
        found: 'No',
        info: []
      },
      fname: 'SAMPLE FATHER NAME',
      din_info: {
        din: '',
        dinAllocationDate: '',
        company_list: []
      },
      status: 'success'
    }
  },
  {
    id: 'business_pan',
    name: 'Business Pan',
    shortDescription: 'Verify business PAN details and retrieve company information for corporate entities.',
    longDescription: 'Verify business PAN details and retrieve comprehensive company information for corporate entities. This service validates business PAN cards and provides detailed information about the registered business entity including registration details and status.',
    credit: 10,
    endpoint: '/verify/business_pan',
    method: 'POST',
    contentType: 'application/json',
    category: 'Business Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The business PAN number to be verified.',
        example: 'AABCU9603R',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      pan_number: 'AABCU9603R',
      business_name: 'ABC PRIVATE LIMITED',
      registration_date: '15/03/1992'
    }
  },
  {
    id: 'pan_detailed',
    name: 'Pan Detailed',
    shortDescription: 'Detailed PAN verification with enhanced information and cross-database validation.',
    longDescription: 'Detailed PAN verification service providing enhanced information and cross-database validation. This comprehensive service offers extensive PAN details with validation across multiple government databases for thorough identity verification.',
    credit: 10,
    endpoint: '/verify/pan_detailed',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The PAN number to be verified.',
        example: 'ABCDE1234F',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      },
      name: {
        type: 'string',
        required: true,
        description: 'The name associated with the PAN number.',
        example: 'JOHN DOE SHARMA'
      }
    },
    sampleOutput: {
      status: 'success',
      result: {
        reference_id: 456789123,
        verification_id: 'VRF_8Xyz2mnoK9_5647382ef7823bde8449cfa33d130ghi',
        status: 'VALID',
        message: 'PAN verified successfully',
        name_provided: 'John Doe Sharma',
        pan: 'ABCDE1234F',
        registered_name: 'JOHN DOE SHARMA',
        name_pan_card: 'JOHN SHARMA',
        first_name: 'JOHN',
        last_name: 'SHARMA',
        type: 'Individual or Person',
        gender: 'MALE',
        date_of_birth: '15-08-1985',
        masked_aadhaar_number: 'XXXXXXXX1234',
        email: 'jo**************45@gmail.com',
        mobile_number: '98XXXXXX76',
        aadhaar_linked: true,
        address: {
          full_address: 'flat no - 204 b, sector 15, noida extension, greater noida, uttar pradesh, india, 201308',
          street: 'Sector 15',
          city: 'Greater Noida',
          state: 'UTTAR PRADESH',
          pincode: 201308,
          country: 'India'
        }
      }
    }
  },
  {
    id: 'pan_nsdl',
    name: 'Pan Nsdl',
    shortDescription: 'Verify PAN details through NSDL database for enhanced accuracy and validation.',
    longDescription: 'Verify PAN details through the National Securities Depository Limited (NSDL) database for enhanced accuracy and validation. This service provides direct access to NSDL\'s PAN verification system for reliable identity verification.',
    credit: 10,
    endpoint: '/verify/pan_nsdl',
    method: 'POST',
    contentType: 'application/json',
    category: 'Identity Verification',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The PAN number to be verified.',
        example: 'ABCDE1234F',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      },
      name: {
        type: 'string',
        required: true,
        description: 'The name associated with the PAN number.',
        example: 'JOHN DOE SHARMA'
      },
      dob: {
        type: 'string',
        required: true,
        description: 'Date of birth in YYYY-MM-DD format.',
        example: '1990-08-15'
      }
    },
    sampleOutput: {
      status: 'success',
      result: {
        verification_id: 'VRF_PanNsdl_87a9c3d2f8e4b53b4c5d6',
        reference_id: 987654321,
        status: 'VALID',
        pan: 'ABCDE1234F',
        name: 'RAJESH KUMAR SINGH',
        dob: '1985-12-25',
        name_match: 'Y',
        dob_match: 'Y',
        pan_status: 'E',
        aadhaar_seeding_status: 'Y',
        aadhaar_seeding_status_desc: 'Aadhaar is linked to PAN'
      }
    }
  },
  {
    id: 'mobile_to_pan',
    name: 'Mobile To Pan',
    shortDescription: 'Retrieve PAN details linked to a mobile number for identity verification.',
    longDescription: 'Retrieve PAN details linked to a mobile number for comprehensive identity verification. This service cross-references mobile numbers with PAN database to provide associated PAN information for enhanced verification workflows.',
    credit: 10,
    endpoint: '/verify/mobile_to_pan',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      mobile: {
        type: 'string',
        required: true,
        description: 'The mobile number to search for.',
        example: '9876543210',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[0-9]{10}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      mobile_number: '9876543210',
      pan_number: 'ABCDE1234F',
      name: 'JOHN DOE'
    }
  },
  {
    id: 'mobile_to_gst',
    name: 'Mobile To Gst',
    shortDescription: 'Retrieve GST details linked to a mobile number for business verification.',
    longDescription: 'Retrieve GST details linked to a mobile number for comprehensive business verification. This service cross-references mobile numbers with GST database to provide associated business information for enhanced verification workflows.',
    credit: 10,
    endpoint: '/verify/mobile_to_gst',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      mobile: {
        type: 'string',
        required: true,
        description: 'The mobile number to search for.',
        example: '9876543210',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[0-9]{10}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      mobile_number: '9876543210',
      gst_number: '29AABCU9603R1ZZ',
      business_name: 'ABC PRIVATE LIMITED'
    }
  },
  {
    id: 'pan_to_gst',
    name: 'Pan To Gst',
    shortDescription: 'Retrieve GST details linked to a PAN number for business verification.',
    longDescription: 'Retrieve GST details linked to a PAN number for comprehensive business verification. This service cross-references PAN numbers with GST database to provide associated business information and registration details.',
    credit: 10,
    endpoint: '/verify/pan_to_gst',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      pan_number: {
        type: 'string',
        required: true,
        description: 'The PAN number to search for.',
        example: 'AABCU9603R',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      pan_number: 'AABCU9603R',
      gst_number: '29AABCU9603R1ZZ',
      business_name: 'ABC PRIVATE LIMITED'
    }
  },
  {
    id: 'mobile_profile',
    name: 'Mobile Profile',
    shortDescription: 'Retrieve comprehensive mobile profile information including carrier details and usage patterns.',
    longDescription: 'Retrieve comprehensive mobile profile information including carrier details, usage patterns, and associated account information. This service provides insights into mobile number ownership and usage characteristics for enhanced verification.',
    credit: 10,
    endpoint: '/verify/mobile_profile',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      mobile: {
        type: 'string',
        required: true,
        description: 'The mobile number to search for.',
        example: '9876543210',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[0-9]{10}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      mobile_number: '9876543210',
      carrier: 'Airtel',
      circle: 'Delhi',
      type: 'Postpaid',
      telecom_provider: 'Bharti Airtel',
      location: {
        state: 'Delhi',
        city: 'New Delhi'
      },
      registration_date: '2018-03-15',
      last_recharge: '2024-01-10',
      plan_type: 'Unlimited',
      is_active: true
    }
  },
  {
    id: 'mobile_profile_advance',
    name: 'Mobile Profile Advance',
    shortDescription: 'Advanced mobile profile analysis with comprehensive insights, usage patterns, and risk assessment.',
    longDescription: 'Advanced mobile profile analysis providing comprehensive insights, detailed usage patterns, and risk assessment. This enhanced service offers deep analytics on mobile number characteristics including behavioral patterns, network analysis, and fraud risk indicators.',
    credit: 10,
    endpoint: '/verify/mobile_profile_advance',
    method: 'POST',
    contentType: 'application/json',
    category: 'Data Linkage',
    sampleInput: {
      mobile: {
        type: 'string',
        required: true,
        description: 'The mobile number to analyze for advanced profile insights.',
        example: '9876543210',
        validation: {
          minLength: 10,
          maxLength: 10,
          pattern: '^[0-9]{10}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      message: 'Mobile profile advance data',
      result: {
        is_valid: true,
        subscriber_status: 'CONNECTED',
        connection_status: {
          status_code: 'DELIVERED',
          error_code_id: ''
        },
        connection_type: '',
        msisdn: {
          msisdn_country_code: '',
          msisdn: '+919876543210',
          type: '',
          mnc: '456',
          imsi: '404456876543210',
          mcc: '404',
          mcc_mnc: '40445'
        },
        current_service_provider: {
          network_prefix: '98765',
          network_name: 'Airtel',
          network_region: 'Delhi',
          mcc: '404',
          mnc: '456',
          country_prefix: '+91',
          country_code: 'IN',
          country_name: 'India'
        },
        original_service_provider: {
          network_prefix: '87654',
          network_name: 'Vodafone',
          network_region: 'Delhi',
          mcc: '404',
          mnc: '456',
          country_prefix: '+91',
          country_code: 'IN',
          country_name: 'India'
        },
        is_roaming: false,
        roaming_service_provider: {
          network_prefix: '',
          network_name: '',
          network_region: '',
          mcc: '',
          mnc: '',
          country_prefix: '',
          country_code: '',
          country_name: ''
        },
        is_ported: true,
        last_ported_date: '',
        porting_history: []
      }
    }
  },
  {
    id: 'vehicle_rc',
    name: 'Vehicle Rc',
    shortDescription: 'Verify vehicle registration certificate details and retrieve vehicle information from RTO database.',
    longDescription: 'Verify vehicle registration certificate (RC) details and retrieve comprehensive vehicle information from the Regional Transport Office (RTO) database. This service validates vehicle registration and provides details about vehicle ownership, specifications, and registration status.',
    credit: 10,
    endpoint: '/verify/vehicle_rc',
    method: 'POST',
    contentType: 'application/json',
    category: 'Vehicle Verification',
    sampleInput: {
      vehicle_number: {
        type: 'string',
        required: true,
        description: 'The vehicle registration number to be verified.',
        example: 'DL01AB1234',
        validation: {
          minLength: 7,
          maxLength: 10,
          pattern: '^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$'
        }
      }
    },
    sampleOutput: {
      status: 'success',
      result: {
        verification_id: 'VRF_j7wTrfT3zY_c9d4d4b05c13f41',
        reference_id: 1888738,
        status: 'VALID',
        reg_no: 'DL01AB1234',
        class: 'Motor Car(LMV)',
        chassis: 'MD7A1D2E3F4G56789',
        engine: 'ABC123456789',
        vehicle_manufacturer_name: 'MARUTI SUZUKI INDIA LIMITED',
        model: 'MARUTI SWIFT VXI DK R2BD4P4',
        vehicle_colour: 'SUPERIOR WHITE',
        type: 'PETROL',
        norms_type: 'BHARAT STAGE VI',
        body_type: '4 DOOR SEDAN',
        owner_count: '1',
        owner: 'JOHN DOE',
        owner_father_name: 'RAJESH DOE',
        mobile_number: null,
        rc_status: 'ACTIVE',
        status_as_on: '2025-01-25',
        reg_authority: 'DELHI RTO, DELHI',
        reg_date: '2018-05-15',
        vehicle_manufacturing_month_year: '04/2018',
        rc_expiry_date: '2033-05-14',
        vehicle_tax_upto: '2033-05-14',
        vehicle_insurance_company_name: 'ICICI LOMBARD GENERAL INSURANCE CO. LTD.',
        vehicle_insurance_upto: '2025-03-20',
        vehicle_insurance_policy_number: 'DL-18-7749-2156-00298475',
        rc_financer: 'HDFC BANK LIMITED',
        present_address: 'NEW DELHI,110001',
        split_present_address: {
          district: ['NEW DELHI'],
          state: [['DELHI', 'DL']],
          city: ['NEW DELHI'],
          pincode: '110001',
          country: ['IN', 'IND', 'INDIA'],
          address_line: null
        },
        permanent_address: 'NEW DELHI,110001',
        split_permanent_address: {
          district: ['NEW DELHI'],
          state: [['DELHI', 'DL']],
          city: ['NEW DELHI'],
          pincode: '110001',
          country: ['IN', 'IND', 'INDIA'],
          address_line: null
        },
        vehicle_cubic_capacity: '1197.00',
        gross_vehicle_weight: '1200',
        unladen_weight: '865',
        vehicle_category: 'LMV',
        rc_standard_cap: '0',
        vehicle_cylinders_no: '4',
        vehicle_seat_capacity: '5',
        vehicle_sleeper_capacity: '0',
        vehicle_standing_capacity: '0',
        wheelbase: '2450',
        vehicle_number: 'DL01AB1234',
        pucc_number: 'DL09847523001542',
        pucc_upto: '2024-11-15',
        blacklist_status: '',
        blacklist_details: [],
        challan_details: [],
        permit_issue_date: 'NA',
        permit_number: null,
        permit_type: null,
        permit_valid_from: 'NA',
        permit_valid_upto: 'NA',
        non_use_status: null,
        non_use_from: null,
        non_use_to: null,
        national_permit_number: null,
        national_permit_upto: null,
        national_permit_issued_by: null,
        is_commercial: false,
        noc_details: null
      }
    }
  },
  {
    id: 'digilocker_initiate_session',
    name: 'Digilocker Initiate Session',
    shortDescription: 'Initialize a DigiLocker verification session for user authentication.',
    longDescription: 'Initialize a DigiLocker verification session for user authentication. This service creates a session for DigiLocker integration and returns the necessary URLs and session details for user authentication flow.',
    credit: 10,
    endpoint: '/verify/digilocker/initiate_session',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      consent_purpose: {
        type: 'string',
        required: true,
        description: 'Purpose for which consent is being given.',
        example: 'Identity verification for account opening'
      },
      redirect_url: {
        type: 'string',
        required: true,
        description: 'URL to redirect after DigiLocker authentication.',
        example: 'http://localhost:3000/'
      },
      redirect_to_signup: {
        type: 'boolean',
        required: true,
        description: 'Whether to redirect to signup flow after authentication.',
        example: true
      },
      consent: {
        type: 'boolean',
        required: true,
        description: 'User consent for data access and verification.',
        example: true
      }
    },
    sampleOutput: {
      status: 'success',
      code: 1000,
      url: 'https://digilocker.idto.ai/digilocker?client_id=28d04bf7-9fa4-46ea-ad39-9d466c1ca3bf&redirect_uri=http%3A//localhost%3A3000/&redirect_to_signup=true&req_docs='
    }
  },
  {
    id: 'digilocker_get_reference',
    name: 'Digilocker Get Reference',
    shortDescription: 'Get reference key after user grants access to DigiLocker documents for verification.',
    longDescription: 'Obtain a reference key once the user provides access to their DigiLocker documents. This service generates a secure reference key that can be used to access and verify authentic documents from the government\'s digital document repository after proper user authorization.',
    credit: 10,
    endpoint: '/verify/digilocker/get_reference',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      code: {
        type: 'string',
        required: true,
        description: 'Authorization code from DigiLocker.',
        example: 'auth_code_abc123xyz789'
      },
      code_verifier: {
        type: 'string',
        required: true,
        description: 'Code verifier for PKCE authentication flow.',
        example: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
      }
    },
    sampleOutput: {
      status: 'success',
      reference_key: '1756104290092_dd18ed2ae992',
      expires_at: '2025-08-25T07:44:50.092566'
    }
  },
  {
    id: 'digilocker_user_details',
    name: 'Digilocker User Details',
    shortDescription: 'Retrieve user profile details from DigiLocker account for identity verification.',
    longDescription: 'Retrieve user profile details from DigiLocker account for comprehensive identity verification. This service accesses user\'s basic profile information stored in their DigiLocker account including name, date of birth, and other verified details.',
    credit: 10,
    endpoint: '/verify/digilocker/user_details',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      }
    },
    sampleOutput: {
      status: 'success',
      user: {
        digilockerid: '38925472394-6d93-11e9-a85e-9457a5645068',
        name: 'John Doe',
        dob: '19011900',
        gender: 'M',
        eaadhaar: 'Y',
        reference_key: '492891ba6126823148656faeda4f809ec6a004f554af713fc8e51a3822df084c',
        mobile: '8656767778',
        picture: 'Base64 encoded picture',
        email: ''
      }
    }
  },
  {
    id: 'digilocker_fetch_aadhaar',
    name: 'Digilocker Fetch Aadhaar',
    shortDescription: 'Fetch Aadhaar document details from user\'s DigiLocker account for verification.',
    longDescription: 'Fetch Aadhaar document details from user\'s DigiLocker account for comprehensive identity verification. This service retrieves verified Aadhaar information stored in the user\'s digital locker including personal details and document metadata.',
    credit: 10,
    endpoint: '/verify/digilocker/fetch_aadhaar',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      }
    },
    sampleOutput: '<xml>document_data</xml>'
  },
  {
    id: 'digilocker_fetch_pan',
    name: 'Digilocker Fetch Pan',
    shortDescription: 'Fetch PAN card details from user\'s DigiLocker account for verification.',
    longDescription: 'Fetch PAN card details from user\'s DigiLocker account for comprehensive identity verification. This service retrieves verified PAN information stored in the user\'s digital locker including personal details and document metadata.',
    credit: 10,
    endpoint: '/verify/digilocker/fetch_pan',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      }
    },
    sampleOutput: '<xml>document_data</xml>'
  },
  {
    id: 'digilocker_issued_docs',
    name: 'Digilocker Issued Docs',
    shortDescription: 'Retrieve list of issued documents available in user\'s DigiLocker account.',
    longDescription: 'Retrieve comprehensive list of issued documents available in user\'s DigiLocker account. This service provides information about all government-issued documents stored in the user\'s digital locker including document types and issue details.',
    credit: 10,
    endpoint: '/verify/digilocker/issued_docs',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      }
    },
    sampleOutput: {
      status: 'success',
      issued_docs: {
        items: [
          {
            name: 'Aadhaar Card',
            type: 'file',
            size: '',
            date: '07-09-2024',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'in.gov.uidai-ADHAR-6f55e7a9e09c',
            doctype: 'ADHAR',
            description: 'Aadhaar Card',
            issuerid: 'in.gov.uidai',
            issuer: 'Unique Identification Authority of India (UIDAI)'
          },
          {
            name: 'Class X Marksheet',
            type: 'file',
            size: '',
            date: '23-08-2018',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'cisce.org-SSCER-3835',
            doctype: 'SSCER',
            description: 'Class X Marksheet',
            issuerid: 'cisce.org',
            issuer: 'Council for the Indian School Certificate Examination (CISCE)'
          },
          {
            name: 'Class XII Marksheet',
            type: 'file',
            size: '',
            date: '23-08-2018',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'cisce.org-HSCER-173835',
            doctype: 'HSCER',
            description: 'Class XII Marksheet',
            issuerid: 'cisce.org',
            issuer: 'Council for the Indian School Certificate Examination (CISCE)'
          },
          {
            name: 'Class XII Passing Certificate',
            type: 'file',
            size: '',
            date: '23-08-2018',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'cisce.org-HPCER-13835',
            doctype: 'HPCER',
            description: 'Class XII Passing Certificate',
            issuerid: 'cisce.org',
            issuer: 'Council for the Indian School Certificate Examination (CISCE)'
          },
          {
            name: 'Driving License',
            type: 'file',
            size: '',
            date: '23-08-2018',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'in.gov.transport-DRVLC-U180016135',
            doctype: 'DRVLC',
            description: 'Driving License',
            issuerid: 'in.gov.transport',
            issuer: 'Ministry of Road Transport and Highways'
          },
          {
            name: 'PAN Verification Record',
            type: 'file',
            size: '',
            date: '04-07-2023',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'in.gov.pan-PANCR-C616G',
            doctype: 'PANCR',
            description: 'PAN Verification Record',
            issuerid: 'in.gov.pan',
            issuer: 'Income Tax Department'
          },
          {
            name: 'Registration of Vehicles',
            type: 'file',
            size: '',
            date: '12-09-2019',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'in.gov.transBD3855',
            doctype: 'RVCER',
            description: 'Registration of Vehicles',
            issuerid: 'in.gov.transport',
            issuer: 'Ministry of Road Transport and Highways'
          },
          {
            name: 'Registration of Vehicles',
            type: 'file',
            size: '',
            date: '13-08-2020',
            parent: '',
            mime: ['application/json', 'application/xml', 'application/pdf'],
            uri: 'in.gov.transport-RVCE29',
            doctype: 'RVCER',
            description: 'Registration of Vehicles',
            issuerid: 'in.gov.transport',
            issuer: 'Ministry of Road Transport and Highways'
          }
        ]
      }
    }
  },
  {
    id: 'digilocker_get_issued_docs',
    name: 'Digilocker Get Issued Docs',
    shortDescription: 'Download specific issued documents from user\'s DigiLocker account in PDF format.',
    longDescription: 'Download specific issued documents from user\'s DigiLocker account in PDF format. This service retrieves the actual document files from DigiLocker\'s secure storage and provides them for verification and processing purposes.',
    credit: 10,
    endpoint: '/verify/digilocker/get_issued_docs',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      },
      uri: {
        type: 'string',
        required: true,
        description: 'The URI of the document to download from DigiLocker.',
        example: 'in.gov.uidai-ADHAR-6f55e7a9e09c'
      }
    },
    sampleOutput: '%PDF-1.7'
  },
  {
    id: 'digilocker_get_issued_docs_xml',
    name: 'Digilocker Get Issued Docs Xml',
    shortDescription: 'Download specific issued documents from user\'s DigiLocker account in XML format.',
    longDescription: 'Download specific issued documents from user\'s DigiLocker account in XML format. This service retrieves document data in structured XML format for easier data extraction and processing of government-issued documents.',
    credit: 10,
    endpoint: '/verify/digilocker/get_issued_docs_xml',
    method: 'POST',
    contentType: 'application/json',
    category: 'DigiLocker',
    sampleInput: {
      reference_key: {
        type: 'string',
        required: true,
        description: 'The reference key obtained from DigiLocker authentication.',
        example: '1756104290092_dd18ed2ae992'
      },
      uri: {
        type: 'string',
        required: true,
        description: 'The URI of the document to download from DigiLocker.',
        example: 'in.gov.uidai-ADHAR-6f55e7a9e09c'
      }
    },
    sampleOutput: '<xml>document_data</xml>'
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
