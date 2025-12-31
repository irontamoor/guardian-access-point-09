/**
 * SecuGen WebAPI Service for Hamster Pro 30 (FAP 30) Fingerprint Scanner
 * 
 * Prerequisites:
 * - Windows 10/11
 * - SecuGen WebAPI Client installed (SgiBioSrv service running)
 * - Hamster Pro 30 driver installed
 * - SecuGen license key for production
 */

const SECUGEN_API_URL = 'https://localhost:8443';
const MATCH_THRESHOLD = 100; // Score above this indicates a positive match

interface SecuGenResponse {
  ErrorCode: number;
  ErrorMessage?: string;
}

interface CaptureResponse extends SecuGenResponse {
  TemplateBase64?: string;
  ImageQuality?: number;
}

interface MatchResponse extends SecuGenResponse {
  MatchingScore?: number;
}

export interface FingerprintServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CaptureResult {
  template: string;
  quality: number;
}

export interface MatchResult {
  isMatch: boolean;
  score: number;
}

/**
 * Check if the SecuGen WebAPI service is available
 */
export async function checkServiceAvailable(): Promise<FingerprintServiceResult<boolean>> {
  try {
    const response = await fetch(`${SECUGEN_API_URL}/SGIFPCapture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'Timeout=1000&Quality=50&licstr=&templateFormat=ISO&imageWSQRate=0.75',
    });
    
    if (response.ok) {
      return { success: true, data: true };
    }
    
    return { success: false, error: 'Service not responding' };
  } catch (error) {
    return { 
      success: false, 
      error: 'SecuGen WebAPI service not available. Please ensure the service is installed and running.',
      data: false
    };
  }
}

/**
 * Capture a fingerprint from the scanner
 * Returns the ISO template as Base64
 */
export async function captureFingerprint(): Promise<FingerprintServiceResult<CaptureResult>> {
  try {
    const response = await fetch(`${SECUGEN_API_URL}/SGIFPCapture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'Timeout=10000&Quality=50&licstr=&templateFormat=ISO&imageWSQRate=0.75',
    });
    
    if (!response.ok) {
      return { success: false, error: 'Failed to communicate with scanner' };
    }
    
    const data: CaptureResponse = await response.json();
    
    if (data.ErrorCode !== 0) {
      return { 
        success: false, 
        error: getErrorMessage(data.ErrorCode) 
      };
    }
    
    if (!data.TemplateBase64) {
      return { success: false, error: 'No fingerprint template received' };
    }
    
    return {
      success: true,
      data: {
        template: data.TemplateBase64,
        quality: data.ImageQuality || 0
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to capture fingerprint. Ensure the scanner is connected and the service is running.' 
    };
  }
}

/**
 * Match two fingerprint templates
 * Returns whether they match and the matching score
 */
export async function matchFingerprints(
  template1: string, 
  template2: string
): Promise<FingerprintServiceResult<MatchResult>> {
  try {
    const response = await fetch(`${SECUGEN_API_URL}/SGIMatchScore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `template1=${encodeURIComponent(template1)}&template2=${encodeURIComponent(template2)}&licstr=&templateFormat=ISO`,
    });
    
    if (!response.ok) {
      return { success: false, error: 'Failed to communicate with matcher service' };
    }
    
    const data: MatchResponse = await response.json();
    
    if (data.ErrorCode !== 0) {
      return { 
        success: false, 
        error: getErrorMessage(data.ErrorCode) 
      };
    }
    
    const score = data.MatchingScore || 0;
    
    return {
      success: true,
      data: {
        isMatch: score > MATCH_THRESHOLD,
        score
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to match fingerprints. Ensure the service is running.' 
    };
  }
}

/**
 * Find a matching fingerprint from a list of templates
 * Returns the index of the matching template or -1 if no match
 */
export async function findMatchingFingerprint(
  capturedTemplate: string,
  storedTemplates: { id: string; template: string }[]
): Promise<FingerprintServiceResult<{ matchedId: string | null; score: number }>> {
  try {
    for (const stored of storedTemplates) {
      const result = await matchFingerprints(capturedTemplate, stored.template);
      
      if (result.success && result.data?.isMatch) {
        return {
          success: true,
          data: {
            matchedId: stored.id,
            score: result.data.score
          }
        };
      }
    }
    
    return {
      success: true,
      data: {
        matchedId: null,
        score: 0
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Error during fingerprint matching process' 
    };
  }
}

/**
 * Get human-readable error message from SecuGen error code
 */
function getErrorMessage(errorCode: number): string {
  const errorMessages: Record<number, string> = {
    0: 'Success',
    1: 'Creation of SGIFPLib object failed',
    51: 'System file load failure',
    52: 'Sensor chip initialization failed',
    53: 'Device not found',
    54: 'Fingerprint image capture timeout',
    55: 'No device available',
    56: 'Driver load failed',
    57: 'Wrong image',
    58: 'Lack of bandwidth',
    59: 'Device busy',
    60: 'Cannot get serial number of the device',
    61: 'Unsupported device',
    63: 'SgiBioSrv didn\'t start; Try image capture again',
    101: 'Invalid template format',
    102: 'Invalid template',
    103: 'Invalid template type',
    104: 'Template extraction failed',
    105: 'Invalid image',
    106: 'Low fingerprint quality',
  };
  
  return errorMessages[errorCode] || `Unknown error (code: ${errorCode})`;
}

export const MATCH_SCORE_THRESHOLD = MATCH_THRESHOLD;
