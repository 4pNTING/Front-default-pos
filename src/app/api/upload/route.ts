import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

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

  if (!backendKey || !platformKey) {
    return { error: NextResponse.json({ message: 'Upload service is not configured' }, { status: 500 }) };
  }

  return { token, backendKey, platformKey };
};

export async function POST(req: Request) {
  const config = await getUploadConfig();

  if ('error' in config) return config.error;

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

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
}

export async function GET(req: Request) {
  const config = await getUploadConfig();

  if ('error' in config) return config.error;

  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ message: 'File URL is required' }, { status: 400 });
  }

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
