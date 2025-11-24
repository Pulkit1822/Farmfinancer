using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context; 
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);
           
             _httpClient = new HttpClient();
             _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
             _context.Dispose();
        }

   [Test, Order(1)]
    public async Task Backend_Test_Post_Method_Register_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        Console.WriteLine(response.StatusCode);
        string responseString = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseString);
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    }
  
   [Test, Order(2)]
    public async Task Backend_Test_Post_Method_Login_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();

        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    }


   [Test, Order(3)]
    public async Task Backend_Test_Post_Loan_With_Token_By_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
        string responseBody = await loginResponse.Content.ReadAsStringAsync();

        dynamic responseMap = JsonConvert.DeserializeObject(responseBody);

        string token = responseMap.token;

        Assert.IsNotNull(token);

        string uniquetitle = Guid.NewGuid().ToString();

        // Use a dynamic and unique userName for admin (appending timestamp)
        string uniqueloantype = $"loan_{uniquetitle}";

         string loanjson = $"{{\"LoanType\":\"{uniqueloantype}\",\"Description\":\"test\",\"InterestRate\":10,\"MaximumAmount\":1000,\"RepaymentTenure\":12,\"Eligibility\":\"Farmer with land ownership\",\"DocumentsRequired\":\"Land documents, ID proof, Income statement\"}}";
        _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
        HttpResponseMessage loanresponse = await _httpClient.PostAsync("/api/loan",
        new StringContent(loanjson, Encoding.UTF8, "application/json"));

       Console.WriteLine("loanresponse"+loanresponse);

        Assert.AreEqual(HttpStatusCode.OK, loanresponse.StatusCode);
    }


[Test, Order(4)]

 public async Task Backend_Test_Post_Loan_Without_Token_By_Admin_Returns_HttpStatusCode_Unauthorized()
{
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
 
        string uniquetitle = Guid.NewGuid().ToString();

        // Use a dynamic and unique userName for admin (appending timestamp)
        string uniqueloantype = $"loan_{uniquetitle}";

       string loanjson = $"{{\"LoanType\":\"{uniqueloantype}\",\"Description\":\"test\",\"InterestRate\":10,\"MaximumAmount\":1000,\"RepaymentTenure\":12,\"Eligibility\":\"Farmer with land ownership\",\"DocumentsRequired\":\"Land documents, ID proof, Income statement\"}}";
        HttpResponseMessage loanresponse = await _httpClient.PostAsync("/api/loan",
        new StringContent(loanjson, Encoding.UTF8, "application/json"));

        Console.WriteLine("loanresponse"+loanresponse);

        Assert.AreEqual(HttpStatusCode.Unauthorized, loanresponse.StatusCode);
}


[Test, Order(5)]
public async Task Backend_Test_Get_Method_Get_LoanById_In_Loan_Service_Fetches_Loan_Successfully()
{
    ClearDatabase();


    var loanData = new Dictionary<string, object>
{
    { "LoanId", 20 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();

    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanService";
    string typeName = "dotnetapp.Models.Loan";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);


    MethodInfo getLoanMethod = serviceType.GetMethod("GetLoanById");
  

    if (getLoanMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var retrievedLoan = (Task<Loan>)getLoanMethod.Invoke(service, new object[] { 20 });

        Assert.IsNotNull(retrievedLoan);
        Assert.AreEqual(loan.LoanType, retrievedLoan.Result.LoanType);
    }
    else
    {
        Assert.Fail();
    }

}

[Test, Order(6)]
public async Task Backend_Test_Put_Method_UpdateLoan_In_Loan_Service_Updates_Loan_Successfully()
{
    ClearDatabase();

    var loanData = new Dictionary<string, object>
{
    { "LoanId", 20},
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();

    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanService";
    string typeName = "dotnetapp.Models.Loan";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);


    MethodInfo updatemethod = serviceType.GetMethod("UpdateLoan", new[] { typeof(int), modelType });


    if (updatemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        // Update the loan

        var updatedLoanData = new Dictionary<string, object>
    {
    { "LoanId", 20 },
    { "LoanType", "Updated Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
   };


        var updatedLoan = Activator.CreateInstance(modelType);
        foreach (var kvp in updatedLoanData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(updatedLoan, kvp.Value);
            }
        }

        var updateResult = (Task<bool>)updatemethod.Invoke(service, new object[] { 20, updatedLoan });

        var updatedLoanFromDb = await _context.Loans.FindAsync(20);
        Assert.IsNotNull(updatedLoanFromDb);
        Assert.AreEqual("Updated Agricultural Loan", updatedLoanFromDb.LoanType);

    }
    else
    {
        Assert.Fail();
    }   
}

[Test, Order(7)]
public async Task Backend_Test_Delete_Method_DeleteLoan_In_Loan_Service_Deletes_Loan_Successfully()
{
     ClearDatabase();
      // Add loan
    var loanData = new Dictionary<string, object>
{
    { "LoanId", 4 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }

    _context.Loans.Add(loan);
    _context.SaveChanges();

    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanService";
    string typeName = "dotnetapp.Models.Loan";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo deletemethod = serviceType.GetMethod("DeleteLoan", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 4 });

        var deletedLoanFromDb = await _context.Loans.FindAsync(4);
        Assert.IsNull(deletedLoanFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(8)]
public async Task Backend_Test_Post_Method_AddLoanApplication_In_LoanApplication_Service_Posts_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

 
    var loanData = new Dictionary<string, object>
{
        { "LoanId", 100 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanApplicationService";
    string typeName = "dotnetapp.Models.LoanApplication";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddLoanApplication", new[] { modelType });

    if (method != null)
    {
   

var loanApplicationData = new Dictionary<string, object>
{
    { "LoanApplicationId", 200 },
    { "UserId", 400 },
    { "LoanId", 100 },
    { "SubmissionDate", DateTime.Now },
    { "LoanStatus", 1 },
    { "FarmLocation", "123 Farm Road, Rural Area, Country" },
    { "FarmerAddress", "456 Farmer's St, City, Country" },
    { "FarmSizeInAcres", 100m },
    { "FarmPurpose", "Broiler farm" }, // could also be "Crop cultivation"
    { "File", "loan_application.pdf" }
};

        var loanApplication = Activator.CreateInstance(modelType);
        foreach (var kvp in loanApplicationData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(loanApplication, kvp.Value);
            }
        }
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { loanApplication });
    
        var addedLoanApplication = await _context.LoanApplications.FindAsync(200);
        Assert.IsNotNull(addedLoanApplication);
        Assert.AreEqual("loan_application.pdf",addedLoanApplication.File);

    }
    else{
        Assert.Fail();
    }
}

[Test, Order(9)]
public async Task Backend_Test_Get_Method_GetLoanApplicationByUserId_In_LoanApplication_Fetches_Successfully()
{
    // Add user
         ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();


    var loanData = new Dictionary<string, object>
{
    { "LoanId", 100 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();


        var loanApplicationData = new Dictionary<string, object>
{
    { "LoanApplicationId", 200 },
    { "UserId", 400 },
    { "LoanId", 100 },
    { "SubmissionDate", DateTime.Now },
    { "LoanStatus", 1 },
    { "FarmLocation", "123 Farm Road, Rural Area, Country" },
    { "FarmerAddress", "456 Farmer's St, City, Country" },
    { "FarmSizeInAcres", 100m },
    { "FarmPurpose", "Broiler farm" }, // could also be "Crop cultivation"
    { "File", "loan_application.pdf" }
};

    var loanApplication = new LoanApplication();
    foreach (var kvp in loanApplicationData)
    {
        var propertyInfo = typeof(LoanApplication).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loanApplication, kvp.Value);
        }
    }
    _context.LoanApplications.Add(loanApplication);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanApplicationService";
    string typeName = "dotnetapp.Models.LoanApplication";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("GetLoanApplicationsByUserId");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = ( Task<IEnumerable<LoanApplication>>)method.Invoke(service, new object[] {400});
        Assert.IsNotNull(result);
          var check=true;
        foreach (var item in result.Result)
        {   
            check=false;
            Assert.AreEqual("456 Farmer's St, City, Country", item.FarmerAddress);
    
        }

        if(check==true)
        {
        Assert.Fail();
        }
    }
    else{
        Assert.Fail();
    }
}

[Test, Order(10)]

public async Task Backend_Test_Put_Method_Update_In_LoanApplication_Service_Updates_Successfully()
{
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();


   

var loanData = new Dictionary<string, object>
{
    { "LoanId", 100 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};

    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();



var loanApplicationData = new Dictionary<string, object>
{
    { "LoanApplicationId", 200 },
    { "UserId", 400 },
    { "LoanId", 100 },
    { "SubmissionDate", DateTime.Now },
    { "LoanStatus", 1 },
    { "FarmLocation", "123 Farm Road, Rural Area, Country" },
    { "FarmerAddress", "456 Farmer's St, City, Country" },
    { "FarmSizeInAcres", 100m },
    { "FarmPurpose", "Broiler farm" }, // could also be "Crop cultivation"
    { "File", "loan_application.pdf" }
};



    var loanApplication = new LoanApplication();
     foreach (var kvp in loanApplicationData)
    {
        var propertyInfo = typeof(LoanApplication).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loanApplication, kvp.Value);
        }
    }
    _context.LoanApplications.Add(loanApplication);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanApplicationService";
    string typeName = "dotnetapp.Models.LoanApplication";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("UpdateLoanApplication",new[] { typeof(int), modelType });

    if (method != null)
    {


        var updatedLoanApplicationData = new Dictionary<string, object>
{
    { "UserId", 400 },
    { "LoanId", 100 },
    { "SubmissionDate", DateTime.Now },
    { "LoanStatus", 1 },
    { "FarmLocation", "123 Farm Road, Rural Area, Country" },
    { "FarmerAddress", "456 Farmer's St, City, Country" },
    { "FarmSizeInAcres", 100m },
    { "FarmPurpose", "Broiler farm" }, // could also be "Crop cultivation"
    { "File", "loan_application.pdf" }
};

    var updatedLoanApplication = new LoanApplication();
    foreach (var kvp in updatedLoanApplicationData)
    {
        var propertyInfo = typeof(LoanApplication).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(updatedLoanApplication, kvp.Value);
        }
    }

        var service = Activator.CreateInstance(serviceType, _context);
        var updateResult = (Task<bool>)method.Invoke(service, new object[] { 200, updatedLoanApplication });
        var updatedLoanFromDb = await _context.LoanApplications.FindAsync(200);
        Assert.IsNotNull(updatedLoanFromDb);
        Assert.AreEqual("456 Farmer's St, City, Country", updatedLoanFromDb.FarmerAddress);   
    }
    else{
        Assert.Fail();
    }
}

[Test, Order(11)]
public async Task Backend_Test_Delete_Method_DeleteLoanApplication_Service_Deletes_LoanApplication_Successfully()
{
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId", 32 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();




    var loanData = new Dictionary<string, object>
{
    { "LoanId", 33 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};


    var loan = new Loan();
    foreach (var kvp in loanData)
    {
        var propertyInfo = typeof(Loan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loan, kvp.Value);
        }
    }
    _context.Loans.Add(loan);
    _context.SaveChanges();


   var loanApplicationData = new Dictionary<string, object>
{
    { "LoanApplicationId", 200 },
    { "UserId", 400 },
    { "LoanId", 100 },
    { "SubmissionDate", DateTime.Now },
    { "LoanStatus", 1 },
    { "FarmLocation", "123 Farm Road, Rural Area, Country" },
    { "FarmerAddress", "456 Farmer's St, City, Country" },
    { "FarmSizeInAcres", 100m },
    { "FarmPurpose", "Broiler farm" }, // could also be "Crop cultivation"
    { "File", "loan_application.pdf" }
};

    var loanApplication = new LoanApplication();
     foreach (var kvp in loanApplicationData)
    {
        var propertyInfo = typeof(LoanApplication).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(loanApplication, kvp.Value);
        }
    }
    _context.LoanApplications.Add(loanApplication);
    _context.SaveChanges();


    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanApplicationService";
    string typeName = "dotnetapp.Models.LoanApplication";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo deletemethod = serviceType.GetMethod("DeleteLoanApplication", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 20 });

        var deletedLoanFromDb = await _context.LoanApplications.FindAsync(20);
        Assert.IsNull(deletedLoanFromDb);
    }
    else
    {
        Assert.Fail();
    }
     ClearDatabase();
}

[Test, Order(12)]
public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
{
        ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddFeedback", new[] { modelType });

    if (method != null)
    {
           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { feedback });
    
        var addedFeedback= await _context.Feedbacks.FindAsync(11);
        Assert.IsNotNull(addedFeedback);
        Assert.AreEqual("Great experience!",addedFeedback.FeedbackText);

    }
    else{
        Assert.Fail();
    }
}

[Test, Order(13)]
public async Task Backend_Test_Delete_Method_Feedback_In_Feeback_Service_Deletes_Successfully()
{
    // Add user
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
     _context.Feedbacks.Add(feedback);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

  
    MethodInfo deletemethod = serviceType.GetMethod("DeleteFeedback", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 11 });

        var deletedFeedbackFromDb = await _context.Feedbacks.FindAsync(11);
        Assert.IsNull(deletedFeedbackFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(14)]
public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 330 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    var feedbackData= new Dictionary<string, object>
    {
        { "FeedbackId", 13 },
        { "UserId", 330 },
        { "FeedbackText", "Great experience!" },
        { "Date", DateTime.Now }
    };

    var feedback = new Feedback();
    foreach (var kvp in feedbackData)
    {
        var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(feedback, kvp.Value);
        }
    }
    _context.Feedbacks.Add(feedback);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("GetFeedbacksByUserId");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = ( Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] {330});
        Assert.IsNotNull(result);
         var check=true;
        foreach (var item in result.Result)
        {
            check=false;
            Assert.AreEqual("Great experience!", item.FeedbackText);
   
        }
        if(check==true)
        {
            Assert.Fail();

        }
    }
    else{
        Assert.Fail();
    }
}

//Exception
[Test, Order(15)]
 
public async Task Backend_Test_Post_Method_AddLoan_In_LoanService_Occurs_LoanException_For_Duplicate_LoanType()
{
    ClearDatabase();

    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.LoanService";
    string typeName = "dotnetapp.Models.Loan";
 
    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);
 
    MethodInfo method = serviceType.GetMethod("AddLoan", new[] { modelType });
 
    if (method != null)
    {
    
        var loanData = new Dictionary<string, object>
    {
    { "LoanId", 2 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
   };

 
        var loan = Activator.CreateInstance(modelType);
        foreach (var kvp in loanData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(loan, kvp.Value);
            }
        }
 
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { loan });
        var addedLoan = await _context.Loans.FindAsync(2);
        Assert.IsNotNull(addedLoan);
   
        var loanData1 = new Dictionary<string, object>
{
    { "LoanId", 3 },
    { "LoanType", "Agricultural Loan" },
    { "Description", "A loan for farm-related expenses" },
    { "InterestRate", 6.5m },
    { "MaximumAmount", 50000m },
    { "RepaymentTenure", 12 }, // in months or years
    { "Eligibility", "Farmer with land ownership" },
    { "DocumentsRequired", "Land documents, ID proof, Income statement" }
};

 
        var loan1 = Activator.CreateInstance(modelType);
        foreach (var kvp in loanData1)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(loan1, kvp.Value);
            }
        }
 
        try
        {
            var result1 = (Task<bool>)method.Invoke(service, new object[] { loan1 });
            Console.WriteLine("res"+result1.Result); 
            Assert.Fail();

        }
        catch (Exception ex)
        {

            Assert.IsNotNull(ex.InnerException);
            Assert.IsTrue(ex.InnerException is LoanException);
    }
    }
    else
    {
        Assert.Fail();
    }
   }
 

private void ClearDatabase()
{
    _context.Database.EnsureDeleted();
    _context.Database.EnsureCreated();
}

}
}






