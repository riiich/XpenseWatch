using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using api.DTOs.AIDTOs;
using api.DTOs.TransactionDTOs;
using api.Interfaces.AccountInterface;
using api.Interfaces.AI_Interface;
using api.Interfaces.GoalInterface;
using api.Interfaces.ITransactionInterface;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.AI;
using Microsoft.VisualBasic;

namespace api.Services
{
    public class AIService : IAIServiceInterface
    {
        private readonly Client _client;
        private readonly ITransactionServiceInterface _transactionService;
        private readonly IAccountServiceInterface _accService;
        // private readonly IGoalServiceInterface _goalService;

        public AIService(IConfiguration config, ITransactionServiceInterface transactionService, IAccountServiceInterface accService)
        {
            _client = new Client(apiKey: config["GEMINI_API_KEY"]);
            _transactionService = transactionService;
            _accService = accService;
        }

        public async Task<AIResponseDTO?> testPrompt(int accId)
        {
            var currAccount = await _accService.GetAccountById(accId);

            if(currAccount == null) return null;

            var accountTransactions = await _transactionService.GetTransactionsByAccountId(accId);
            var geminiContentString = "";

            if(accountTransactions.Count() > 0)
            {
                geminiContentString = JsonSerializer.Serialize(accountTransactions);
            }

            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: "gemini-3.5-flash", 
                    config: new GenerateContentConfig
                    {
                        SystemInstruction = new Content {
                            Parts = new List<Part> 
                            {   
                                new Part
                                {
                                    Text = "You are a personal financial analyst/advisor. Be concise and coherent. Suggest some realistic " +
                                            "goals and expectations based on the user's financial data in each account. Be analytical and suggest " +
                                            "or let the user know that they are on track or derailing from their goal (if any). Keep all responses " + 
                                            "under 350 characters. Mention the current balance, goals, and cost of transactions relative to their " +
                                            "balance."
                                }
                            }
                        }
                    },
                    contents: geminiContentString
                );

                if(response?.Candidates == null || response.Candidates.Count == 0) 
                    throw new InvalidOperationException("Gemini returned no candidates from the response.");

                var geminiParts = response.Candidates[0].Content?.Parts[0] 
                                  ?? throw new InvalidOperationException("Gemini returned no parts from the API...");

                var analysis = new AIResponseDTO
                {
                    financeAnalysis = geminiParts.Text ?? "Analysis currently not available..."
                };

                return analysis;
            }
            catch(HttpRequestException ex)
            {
                throw new HttpRequestException("Network error calling Gemini API", ex);
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex);
                throw new Exception("Unexpected error attempting to call Gemini API", ex);
            }
        }

        // public async Task<AIResponseDTO> userPrompt(AIFinancialRequestDTO userPrompt)
        // {
        // }

        // public async Task<AIResponseDTO> getFinancialAnalysis(AIFinancialRequestDTO financialInfo)
        // {
        //     string aiDescriptor = "You are a expert financial analyst that looks analyzes a user's financial situation. " +
        //                           "The user may have multiple accounts, so you will have to look at multiple accounts that the " +
        //                           "user may have (checkings, investments, budget accounts, savings, etc.). ";

        // }

        // private async Task<TransactionResponseDTO[]> aggregateTransactions(string userId)
        // {
        //     var allUserTransactions = 
        // }
    }
}