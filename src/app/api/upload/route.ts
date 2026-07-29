import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import fs from 'fs';
import path from 'path';

const FILE_SERVICE_BASE_URL = process.env.FILE_SERVICE_BASE_URL || 'https://files.laoworld.la';

const getUploadEndpoint = (uploadType: FormDataEntryValue | null) => {
  const normalizedType = uploadType === 'image' ? 'image' : 'pdf';

  return normalizedType === 'image'
    ? `${FILE_SERVICE_BASE_URL}/api/image-files/upload`
    : `${FILE_SERVICE_BASE_URL}/api/pdf-files/upload`;
};

const getAuthHeaders = (token: string, backendKey: string, platformKey: string) => ({
  Authorization: `Bearer ${token}`,
  backendKey,
  platform: platformKey,
});

const getUploadConfig = async () => {
  const session = await getServerSession(authOptions);
  const token = session?.authorization;
  const backendKey = process.env.UPLOAD_BACKEND_KEY || process.env.NEXT_PUBLIC_UPLOAD_BACKEND_KEY;
  const platformKey = process.env.UPLOAD_PLATFORM_KEY || process.env.NEXT_PUBLIC_UPLOAD_PLATFORM_KEY;

  if (!token) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  // If keys are provided, use external file service
  if (backendKey && platformKey) {
    return { token, backendKey, platformKey, isExternal: true };
  }

  // Fallback to local file storage mode if keys are not configured
  return { token, isExternal: false };
};

export async function POST(req: Request) {
  const config = await getUploadConfig();

  if ('error' in config) return config.error;

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

  // If external file service is configured, proxy request upstream
  if (config.isExternal && config.backendKey && config.platformKey) {
    try {
      const upstreamFormData = new FormData();
      upstreamFormData.append('file', file);

      for (const field of ['ownerId', 'ownerType', 'originalName']) {
        const value = formData.get(field);
        if (typeof value === 'string') {
          upstreamFormData.append(field, value);
        }
      }

      const response = await fetch(getUploadEndpoint(formData.get('uploadType')), {
        method: 'POST',
        body: upstreamFormData,
        headers: getAuthHeaders(config.token, config.backendKey, config.platformKey),
      });

      const responseBody = await response.text();

      return new NextResponse(responseBody, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/json',
        },
      });
    } catch (err) {
      console.warn('External upload failed, falling back to local storage:', err);
    }
  }

  // Local Storage Fallback Mode (Monolith / No external service required)
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileUrl: fileUrl,
      downloadUrl: fileUrl,
      file: {
        _id: `local-${Date.now()}`,
        fileName: fileName,
        filePath: fileUrl,
      },
    });
  } catch (error: any) {
    console.error('Local upload error:', error);
    return NextResponse.json({ message: 'Failed to save file locally: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const config = await getUploadConfig();

  if ('error' in config) return config.error;

  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ message: 'File URL is required' }, { status: 400 });
  }

  // If local upload path (/uploads/filename)
  if (fileUrl.startsWith('/uploads/')) {
    const localFilePath = path.join(process.cwd(), 'public', fileUrl);
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = await fs.promises.readFile(localFilePath);
      const ext = path.extname(localFilePath).toLowerCase();
      const contentType = ext === '.pdf' ? 'application/pdf' : ext === '.png' ? 'image/png' : 'image/jpeg';
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
        },
      });
    }
  }

  // External file download proxy
  if (config.isExternal && config.backendKey && config.platformKey) {
    const baseUrl = new URL(FILE_SERVICE_BASE_URL);
    const resolvedUrl = fileUrl.startsWith('http') ? new URL(fileUrl) : new URL(fileUrl, baseUrl);

    if (resolvedUrl.origin !== baseUrl.origin) {
      return NextResponse.json({ message: 'Invalid file URL' }, { status: 400 });
    }

    const response = await fetch(resolvedUrl, {
      method: 'GET',
      headers: getAuthHeaders(config.token, config.backendKey, config.platformKey),
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      },
    });
  }

  return NextResponse.json({ message: 'File not found' }, { status: 404 });
}
