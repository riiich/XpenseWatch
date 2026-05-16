using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AIDTOs;
using api.DTOs.TransactionDTOs;
using api.Interfaces.AI_Interface;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.AI;
using Microsoft.VisualBasic;

namespace api.Services
{
    public class AIService : IAIServiceInterface
    {
        private readonly Client _client;
        public AIService(IConfiguration config)
        {
            _client = new Client(apiKey: config["GEMINI_API_KEY"]);
        }

        public async Task<string> testPrompt()
        {
            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: "gemini-2.5-flash", 
                    config: new GenerateContentConfig
                    {
                        SystemInstruction = new Content {
                            Parts = new List<Part> 
                            {   
                                new Part{Text="You are a personal financial analyst/advisor. Be concise and coherent. Suggest some realistic " +
                                              "goals and expectations based on the user's financial data in each account. Be analytical and suggest " +
                                              "or let the user know that they are on track or derailing from their goal (if any). Keep all responses " + 
                                              "under 300 characters."}
                            }
                        }
                    },
                    contents: @"Account: High Yields Savings Account. [{""id"":23,""transactionDate"":""2026-04-14"",""editDate"":""2026-04-14T23:29:32.8289038"",""accountName"":""travel savings"",""categoryName"":""Travel"",""amount"":150,""currency"":""USD"",""description"":""test123"",""notes"":""123etst"",""isIncome"":true,""isCredit"":false,""isManual"":true,""isDeleted"":false},{""id"":24,""transactionDate"":""2026-04-14"",""editDate"":""2026-04-14T23:45:57.2174339"",""accountName"":""travel savings"",""categoryName"":""Income"",""amount"":150,""currency"":""USD"",""description"":""travevl tetst"",""notes"":""test123 travel"",""isIncome"":true,""isCredit"":false,""isManual"":true,""isDeleted"":false},{""id"":24,""transactionDate"":""2026-04-14"",""editDate"":""2026-04-14T23:48:40.0151864"",""accountName"":""travel savings"",""categoryName"":""Travel"",""amount"":150,""currency"":""USD"",""description"":""negative"",""notes"":""negative"",""isIncome"":false,""isCredit"":false,""isManual"":true,""isDeleted"":false},{""id"":29,""transactionDate"":""2026-04-16"",""editDate"":""2026-04-16T22:39:22.4359604"",""accountName"":""travel savings"",""categoryName"":""Subscription"",""amount"":1000,""currency"":""USD"",""description"":""travel budget"",""notes"":""travel budget"",""isIncome"":true,""isCredit"":false,""isManual"":true,""isDeleted"":false},{""id"":30,""transactionDate"":""2025-03-17"",""editDate"":""2026-04-17T19:14:47.3231351"",""accountName"":""travel savings"",""categoryName"":""Utilities"",""amount"":150,""currency"":""USD"",""description"":""lkrar321"",""notes"":""qwnej1"",""isIncome"":true,""isCredit"":false,""isManual"":true,""isDeleted"":false},{""id"":31,""transactionDate"":""2026-04-17"",""editDate"":""2026-04-17T19:23:40.5178401"",""accountName"":""travel savings"",""categoryName"":""Health"",""amount"":150,""currency"":""USD"",""description"":""2e1e12ee"",""notes"":""e12e2"",""isIncome"":false,""isCredit"":false,""isManual"":true,""isDeleted"":false}]"
                );

                if(response?.Candidates == null || response.Candidates.Count == 0) 
                    throw new InvalidOperationException("Gemini returned no candidates from the ");

                var geminiParts = response.Candidates[0].Content?.Parts[0] 
                                  ?? throw new InvalidOperationException("Gemini returned no parts from the API...");

                return geminiParts.Text ?? throw new InvalidOperationException("Error retrieving text response from Gemini...");
            }
            catch(HttpRequestException ex)
            {
                throw new HttpRequestException("Network error calling Gemini API", ex);
            }
            catch(Exception ex)
            {
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