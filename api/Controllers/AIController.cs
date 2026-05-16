using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces.AI_Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> test()
        {
            return Ok(new { aiResponse = _aiService.testPrompt() });
        }
    }
}