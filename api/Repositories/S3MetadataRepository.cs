using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;
using api.Models;
using api.Enums;
using CsvHelper.Configuration.Attributes;

namespace api.Repositories;

public class S3MetadataRepository : IS3MetadataRepository
{
    private readonly ApplicationDBContext _context;

    public S3MetadataRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<S3Metadata> CreateAsync(S3Metadata item)
    {
        _context.S3Metadata.Add(item);
        await _context.SaveChangesAsync();

        return item;
    }

    public async Task<S3Metadata> UpdateAsync(S3Metadata item)
    {
        await _context.SaveChangesAsync();

        return item;
    }

    public async Task<S3Metadata?> GetByIdAsync(int id)
    {
        return await _context.S3Metadata
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);
    }

    public async Task<S3Metadata?> GetByUserIdAndIdAsync(string userId, int s3MetadataId)
    {
        return await _context.S3Metadata
            .FirstOrDefaultAsync(item => item.UserId == userId && item.Id == s3MetadataId);
    }

    public async Task<IReadOnlyList<S3Metadata>> GetByUserIdAsync(string userId)
    {
        return await _context.S3Metadata
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .OrderByDescending(item => item.UploadedAt)
            .ToListAsync();
    }

    public async Task<S3Metadata?> GetReceiptByTransactionIdAsync(int transactionId, string userId)
    {
        return await _context.S3Metadata.FirstOrDefaultAsync(s => s.TransactionId == transactionId && 
                                                                  s.UserId == userId &&
                                                                  s.FileCategory == UploadCategory.Receipt
                                                                  );
    }

    // public async Task<S3Metadata?> GetStatementByAccountIdAsync(int transactionId, string userId)
    // {
        
    // }

    public async Task<S3Metadata?> UpdateLastRetrievedAsync(int id)
    {
        S3Metadata? item = await _context.S3Metadata.FirstOrDefaultAsync(s3Metadata => s3Metadata.Id == id);

        if (item is null)
        {
            return null;
        }

        item.LastRetrieved = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return item;
    }

    public async Task DeleteAsync(S3Metadata item)
    {
        _context.S3Metadata.Remove(item);
        await _context.SaveChangesAsync();
    }
}