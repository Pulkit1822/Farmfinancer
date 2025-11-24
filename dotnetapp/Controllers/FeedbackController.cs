using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/Feedback")]
    public class FeedbackController : ControllerBase
    {
        public readonly FeedbackService db;
        public FeedbackController(FeedbackService db1)
        {
            db = db1;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<Feedback>>> GetAllFeedback()
        {
            var feedbacks = await db.GetAllFeedback();
            return Ok(feedbacks);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Feedback>> GetFeedbackById(int id)
        {
            var feedback = await db.GetFeedbackById(id);
            if (feedback == null)
                return NotFound();
            return Ok(feedback);
        }
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId)
        {
            var feedbacks = await db.GetFeedbacksByUserId(userId);
            return Ok(feedbacks);
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<bool>> AddFeedback([FromBody] Feedback feedback)
        {
            var success = await db.AddFeedback(feedback);
            if (success)
                return Ok(true);
            return BadRequest(false);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Feedback>> UpdateFeedback(int id, [FromBody] Feedback feedback)
        {
            var updatedFeedback = await db.UpdateFeedback(id, feedback);
            if (updatedFeedback == null)
                return NotFound();
            return Ok(updatedFeedback);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            var result = await db.DeleteFeedback(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}