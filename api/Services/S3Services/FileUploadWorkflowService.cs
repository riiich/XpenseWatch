using System.Data;
using api.Enums;
using api.Interfaces;
using api.Models;

namespace api.Services;

public class FileUploadWorkflowService : IFileUploadWorkflowService
{
    private readonly ILogger<FileUploadWorkflowService> _logger;
    private readonly IS3FileUploadService _storageService;
    private readonly IS3MetadataRepository _s3MetadataRepository;

    public FileUploadWorkflowService(
        ILogger<FileUploadWorkflowService> logger,
        IS3FileUploadService storageService,
        IS3MetadataRepository s3MetadataRepository)
    {
        _logger = logger;
        _storageService = storageService;
        _s3MetadataRepository = s3MetadataRepository;
    }

    public async Task<S3Metadata> UploadAsync(string userId, int? transactionId, FileUploadInput file, UploadCategory uploadCategory)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("A user id is required before uploading files.");
        }

        await _storageService.ValidateFileAsync(file);

        string s3Key = _storageService.CreateObjectKey(file.FileName, uploadCategory);

        S3Metadata item = new()
        {
            UserId = userId.Trim(),
            TransactionId = transactionId,
            S3Key = s3Key,
            Status = S3MetadataStatus.Pending,
            FileName = file.FileName,
            MimeType = file.ContentType,
            FileSize = file.Length
        };

        await _s3MetadataRepository.CreateAsync(item);

        try
        {
            await _storageService.UploadFileAsync(file, s3Key);
        }
        catch (Exception uploadException)
        {
            _logger.LogError(
                uploadException,
                "S3 upload failed for metadata {S3MetadataId}. Bucket key: {S3Key}, file: {FileName}",
                item.Id,
                item.S3Key,
                item.FileName
            );

            item.Status = S3MetadataStatus.Failed;

            try
            {
                await _s3MetadataRepository.UpdateAsync(item);
            }
            catch (Exception statusUpdateException)
            {
                _logger.LogError(
                    statusUpdateException,
                    "Failed to mark S3 metadata {S3MetadataId} as failed after upload error. S3 key: {S3Key}",
                    item.Id,
                    item.S3Key);
            }

            throw;
        }

        item.Status = S3MetadataStatus.Uploaded;
        item.UploadedAt = DateTime.UtcNow;

        return await _s3MetadataRepository.UpdateAsync(item);
    }

    public async Task DeleteReceiptAsync(string userId, int transactionId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("A user id is required before uploading files.");
        }

        var receipt = await _s3MetadataRepository.GetReceiptByTransactionIdAsync(transactionId, userId);

        if(receipt is null)
        {
            throw new KeyNotFoundException("No receipt exists for this transaction...");
        }

        await _storageService.DeleteFileAsync(receipt.S3Key);
        await _s3MetadataRepository.DeleteAsync(receipt);
    }
}
