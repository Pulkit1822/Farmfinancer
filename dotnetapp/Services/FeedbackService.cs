using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class FeedbackService
    {
        public readonly ApplicationDbContext db;
        public FeedbackService(ApplicationDbContext db1)
        {
            db = db1;
        }
        public async Task<List<Feedback>> GetAllFeedback()
        {
            return await db.Feedbacks.Include(f => f.User).ToListAsync();
        }
        public async Task<Feedback?> GetFeedbackById(int id)
        {
            return await db.Feedbacks.Include(f => f.User)
            .FirstOrDefaultAsync(f => f.FeedbackId == id);
        }
        public async Task<bool> AddFeedback(Feedback feedback)
        {
            db.Feedbacks.Add(feedback);
            var result = await db.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Feedback?> UpdateFeedback(int id, Feedback updatedFeedback)
        {
            var existingFeedback = await db.Feedbacks.FindAsync(id);
            if (existingFeedback == null) return null;
            existingFeedback.FeedbackText = updatedFeedback.FeedbackText;
            existingFeedback.Date = updatedFeedback.Date;
            existingFeedback.UserId = updatedFeedback.UserId;
            await db.SaveChangesAsync();
            return existingFeedback;
        }

        public async Task<bool> DeleteFeedback(int id)
        {
            var feedback = await db.Feedbacks.FindAsync(id);
            if (feedback == null) return false;

            db.Feedbacks.Remove(feedback);
            await db.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await db.Feedbacks.Include(f => f.User)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }
    }
}