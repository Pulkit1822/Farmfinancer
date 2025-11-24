using log4net;

public class LogService : ILogService{
    private static readonly ILog log = LogManager.GetLogger(typeof(LogService));
    public void LogUserAction(int statusCode, string username, string action, string status = "success")
    {
    var istTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
    var time = istTime.ToString("HH:mm") + " hrs";
        string message;
        if (action.ToLower().Contains("login") && status == "fail"){
            message = $"Status {statusCode} : User \"{username}\" attempted login (status:fail) at \"{time}\"";
        }
        else{
            message = $"Status {statusCode} : User \"{username}\" {action} at \"{time}\"";
        }
        log.Info(message);
    }
}