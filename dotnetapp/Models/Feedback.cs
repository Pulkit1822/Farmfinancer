using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Feedback
    {
        public int FeedbackId{get;set;}
        public int UserId{get;set;}
        // [JsonIgnore]
        public User? User{get;set;}
        public string FeedbackText{get;set;}
        public DateTime Date{get;set;}
    }
}