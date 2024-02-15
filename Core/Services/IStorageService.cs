namespace Core
{
    public interface IStorageService
    {
        Task<string> UploadFileAsync(string blobName, Stream stream);
        Task<Stream> DownloadFileAsync(string blobName);
        Task<bool> DeleteFileAsync(string blobName);
    }
}
