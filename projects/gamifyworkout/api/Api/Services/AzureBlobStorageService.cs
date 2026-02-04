using Core;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage;

namespace Api
{
    public class AzureBlobStorageService : IStorageService
    {
        private readonly CloudBlobContainer _blobContainer;

        public AzureBlobStorageService(IConfiguration configuration, string containerName)
        {
            var connectionString = configuration.GetConnectionString("AzureBlobStorage");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new MissingFieldException($"{nameof(AzureBlobStorageService)} connection string is missing.");
            }

            var storageAccount = CloudStorageAccount.Parse(connectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            _blobContainer = blobClient.GetContainerReference(containerName);
            _blobContainer.CreateIfNotExistsAsync().Wait();
            _blobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
        }

        public async Task<string> UploadFileAsync(string blobName, Stream stream)
        {
            var blob = _blobContainer.GetBlockBlobReference(blobName);
            await blob.UploadFromStreamAsync(stream);
            return blob.Uri.ToString();
        }

        public async Task<Stream> DownloadFileAsync(string blobName)
        {
            var blob = _blobContainer.GetBlockBlobReference(blobName);
            var memoryStream = new MemoryStream();
            await blob.DownloadToStreamAsync(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }

        public async Task<bool> DeleteFileAsync(string blobName)
        {
            return await _blobContainer
                .GetBlockBlobReference(blobName)
                .DeleteIfExistsAsync();
        }
    }
}
