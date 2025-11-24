public interface ILogService
{
    void LogUserAction(int statusCode, string username, string action, string status = "success");
}