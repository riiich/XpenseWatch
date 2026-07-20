using api.Interfaces;
using api.Models;

namespace api.Services;

public class S3MetadataService : IS3MetadataService
{
    private readonly IS3MetadataRepository _s3MetadataRepository;

    public S3MetadataService(IS3MetadataRepository s3MetadataRepository)
    {
        _s3MetadataRepository = s3MetadataRepository;
    }

    public async Task<S3Metadata?> GetByIdAsync(int id)
    {
        return await _s3MetadataRepository.GetByIdAsync(id);
    }

    public async Task<S3Metadata?> GetByUserIdAndIdAsync(string userId, int s3MetadataId)
    {
        return await _s3MetadataRepository.GetByUserIdAndIdAsync(userId, s3MetadataId);
    }

    public async Task<IReadOnlyList<S3Metadata>> GetByUserIdAsync(string userId)
    {
        return await _s3MetadataRepository.GetByUserIdAsync(userId);
    }

    public async Task<S3Metadata?> GetByTransactionIdAsync(int transactionId, string userId)
    {
        return await _s3MetadataRepository.GetReceiptByTransactionIdAsync(transactionId, userId);
    }

    public async Task DeleteAsync(S3Metadata item)
    {
        await _s3MetadataRepository.DeleteAsync(item);
    }

    public async Task<S3Metadata?> MarkRetrievedAsync(int id)
    {
        return await _s3MetadataRepository.UpdateLastRetrievedAsync(id);
    }
}