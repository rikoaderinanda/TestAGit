using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestAGit.Services;
using TestAGit.Models;

namespace TestAGit.api
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly IPlanningRepository _planningRepository;

        public PlanningController(IPlanningRepository planningRepository)
        {
            _planningRepository = planningRepository;
        }

        [HttpGet("GetPlan/{Filter}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAll(string Filter)
        {
            var List = await _planningRepository.GetAllAsync(Filter);
            return Ok(List);
        }

        [HttpGet("GetPlanById/{Id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetPlanById(string Id)
        {
            var List = await _planningRepository.GetPlanningById(Id);
            return Ok(List);
        }

        [HttpPost("CreateNewPlan")]
        public async Task<ActionResult<dynamic>> CreateNewPlan([FromBody] CreatePlanDto planData)
        {
            if (planData == null)
            {
                return BadRequest("Plan data is required.");
            }
            await _planningRepository.CreateNewPlan(planData);   
            return Ok(planData);
        }

        [HttpPost("UpdatePlan")]
        public async Task<ActionResult<dynamic>> UpdatePlan([FromBody] CreatePlanDto planData)
        {
            
            if (planData == null)
            {
                return BadRequest("Plan data is required.");
            }   
            await _planningRepository.UpdatePlan(planData);
            return Ok(planData);
        }

        [HttpPost("Approval/{id}")]
        public async Task<ActionResult<dynamic>> Approval(string id)
        {
            if (id == null)
            {
                return BadRequest("ID data is required.");
            }
            await _planningRepository.Approval(id,2);
            return Ok(id);
        }   

        [HttpPost("Declined/{id}")]
        public async Task<ActionResult<dynamic>> Declined(string id)
        {
            
            if (id == null)
            {
                return BadRequest("ID data is required.");
            }
            await _planningRepository.Approval(id,0);
            return Ok(id);
        }   
    }
}