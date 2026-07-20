import { gql } from "@apollo/client";

export const LOAD_ZONE = gql`
  query loadZone($input: LoadZoneDto!) {
    loadZone(input: $input) {
      count
      zone {
        _id
        name
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation createZone($input: CreateZoneDto!) {
    createZone(input: $input) {
      zone {
        _id
        name
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation updateZone($input: UpdateZoneDto!) {
    updateZone(input: $input) {
      zone {
        _id
        name
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;


export const DELETE_ZONE = gql`
  mutation deleteZone($input: DeleteZoneDto!) {
    deleteZone(input: $input) {
      zone {
        _id
      }
    }
  }
`;

export const RESTORE_DELETE_ZONE = gql`
  mutation restoreZone($input: RestoreZoneDto!) {
    restoreZone(input: $input) {
      zone {
        _id
        name
        isActive
      }
    }
  }
`;
