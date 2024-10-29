import  fs from 'fs';
import google, {drive_v3, Auth} from 'googleapis';
import apikeys from '../apiKeys.json';
import { TransactionBaseService } from '@medusajs/medusa';

type DriveFile = drive_v3.Schema$Drive;

const SCOPE = ['https://www.googleapis.com/auth/drive'];
// console.log(apikeys);

interface ApiKeys {
  client_email: string;
  private_key: string;
}

class GoogleDriveService extends TransactionBaseService{
    protected apikeys: ApiKeys;
    protected scope: string[];
    private driveClient: drive_v3.Drive | null = null;

    constructor(container) {
      super(container);
      this.apikeys = apikeys;
      this.scope = SCOPE;
    }

  // A method that can provide access to Google Drive API
  async authorize(): Promise<any> {
    // console.log('Authorizing Google Drive API with api keys:', this.apikeys);
    const jwtClient = new Auth.JWT(
      this.apikeys.client_email,
      undefined,
      this.apikeys.private_key,
      this.scope
    );
    // console.log(jwtClient);
    await jwtClient.authorize();
    this.driveClient = new drive_v3.Drive({ auth: jwtClient });
    return jwtClient;
  }

  async uploadFile(filePath: string, fileName: string, folderId: string): Promise<DriveFile> {
    if (!this.driveClient) {
      throw new Error('Google Drive client not initialized. Call authorize() first.');
    }

    // FolderID de texto a ID
    const mapIds = {
      productos: "1aWXLdb3ZXVtTjp4BjphIEn67ndxptfi-",
      yape: "1fXBwI-hH4XCP0pwQpewP58Ge_k5qot5-",
      plin: "1-5m51RCL88mBg8LMoIigra4b9AIQ74zt",
      pedidos: "1JZLvX-20RWZdLdOKFMLA-5o25GSI4cNb",
      mermas: "1J4tn96Xy49MsU5gVl7bWuWgoQsZBFq1t",
    }

    folderId = mapIds[folderId] || folderId;

    return new Promise((resolve, reject) => {
      const fileMetaData = {
        name: fileName,
        parents: [folderId], // A folder ID to which file will get uploaded
      };

      this.driveClient!.files.create(
        {
          requestBody: fileMetaData,
          media: {
            body: fs.createReadStream(filePath), // files that will get uploaded
            mimeType: 'application/octet-stream',
          },
          fields: 'id',
        },
        (error, file) => {
          if (error) {
            return reject(error);
          }
          resolve(file.data);
        }
      );
    });
  }

  // A method to generate a pre-signed URL for file upload
  async generateUploadUrl(fileName: string, folderId: string): Promise<string> {
    if (!this.driveClient) {
      throw new Error('Google Drive client not initialized. Call authorize() first.');
    }

    const fileMetaData = {
      name: fileName,
      parents: [folderId], // A folder ID to which file will get uploaded
    };

    const file = await this.driveClient.files.create({
      requestBody: fileMetaData,
      fields: 'id',
    });

    const fileId = file.data.id;

    const res = await this.driveClient.files.get({
      fileId: fileId,
      alt: 'media',
    });

    return res.config.url.toString();
  }
}
export default GoogleDriveService;