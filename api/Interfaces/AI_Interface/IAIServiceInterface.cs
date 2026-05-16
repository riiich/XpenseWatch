using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AIDTOs;
using api.DTOs.TransactionDTOs;
using api.Models;

namespace api.Interfaces.AI_Interface
{
    public interface IAIServiceInterface
    {
        Task<string> testPrompt();
        // Task<AIResponseDTO> userPrompt(AIFinancialRequestDTO userPrompt);
        // Task<AIResponseDTO> getFinancialAnalysis(AIFinancialRequestDTO financialInfo);
        // Task<TransactionResponseDTO[]> aggregateTransactions(string userId);
    }
}