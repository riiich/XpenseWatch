using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces.AI_Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace api.Controllers
{
    [ApiController]
    [Route("api/prompt")]
    public class AIController : ControllerBase
    {
        IAIServiceInterface _aiService;

        public AIController(IAIServiceInterface aiService)
        {
            _aiService = aiService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAIAnalysis([FromQuery] int accId)
        {
            var foo = await _aiService.testPrompt(accId);

            return Ok(foo);
        }
    }
}