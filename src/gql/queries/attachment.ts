import { gql } from '@apollo/client';

export const LOAD_ATTACHMENT = gql`
  query LoadAttachment($input: LoadAttachmentDto) {
    loadAttachment(input: $input) {
      count
      attachment {
        _id
        uniqueId
        uid
        ownerId
        ownerType
        originalName
        fileName
        fileUrl
        filePath
        fileSize
        mimeType
        uploadType
        status
        errorMessage
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;

export const LOAD_ATTACHMENT_BY_ID = gql`
  query LoadAttachmentById($input: LoadAttachmentByIdDto!) {
    loadAttachmentById(input: $input) {
      attachment {
        _id
        uniqueId
        uid
        ownerId
        ownerType
        originalName
        fileName
        fileUrl
        filePath
        fileSize
        mimeType
        uploadType
        status
        errorMessage
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;

export const CREATE_ATTACHMENT = gql`
  mutation CreateAttachment($input: CreateAttachmentDto!) {
    createAttachment(input: $input) {
      attachment {
        _id
        uniqueId
        uid
        ownerId
        ownerType
        originalName
        fileName
        fileUrl
        filePath
        fileSize
        mimeType
        uploadType
        status
        errorMessage
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;

export const UPDATE_ATTACHMENT = gql`
  mutation UpdateAttachment($input: UpdateAttachmentDto!) {
    updateAttachment(input: $input) {
      attachment {
        _id
        uniqueId
        uid
        ownerId
        ownerType
        originalName
        fileName
        fileUrl
        filePath
        fileSize
        mimeType
        uploadType
        status
        errorMessage
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  }
`;

export const DELETE_ATTACHMENT = gql`
  mutation DeleteAttachment($input: DeleteAttachmentDto!) {
    deleteAttachment(input: $input) {
      attachment {
        _id
      }
    }
  }
`;

export const RESTORE_ATTACHMENT = gql`
  mutation RestoreAttachment($input: RestoreAttachmentDto!) {
    restoreAttachment(input: $input) {
      attachment {
        _id
        isActive
      }
    }
  }
`;
