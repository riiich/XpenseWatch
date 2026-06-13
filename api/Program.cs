using api.Data;
using api.Interfaces;
using api.Interfaces.ITransactionInterface;
using api.Interfaces.UserInterface;
using api.Interfaces.AccountInterface;
using api.Repositories;
using api.Services;
using Microsoft.EntityFrameworkCore;
using api.Models;
using iText.Kernel.XMP.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using api.Interfaces.ITokenServiceInterface;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using api.Interfaces.CategoryInterface;
using api.Interfaces.GoalInterface;
using api.Interfaces.AI_Interface;
using Amazon.S3;
using Amazon;
using Amazon.Runtime;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;


var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// used to authorize whether the jwt is valid IN swagger 
    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo { Title = "XpenseWatch API", Version = "v1" });

        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token.",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });

        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

builder.Services.AddDbContext<ApplicationDBContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

// User configuration with IdentityRole 
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;     // by default, it only checks for UserName so have to explicitly make email unique

    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8; 
}).AddEntityFrameworkStores<ApplicationDBContext>();

// jwt configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SigningKey"]))
    };
});

// configure AWS
builder.Services.Configure<S3Settings>(
    builder.Configuration.GetSection("AWS")
);
builder.Services.Configure<UploadSettings>(
    builder.Configuration.GetSection("Upload")
);
builder.Services.Configure<FormOptions>(options =>
{
    UploadSettings uploadSettings = builder.Configuration.GetSection("Upload").Get<UploadSettings>() ?? new UploadSettings();
    options.MultipartBodyLengthLimit = uploadSettings.MaxFileSizeBytes;
});
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var settings = sp
        .GetRequiredService<IOptions<S3Settings>>()
        .Value;

    var credentials = new BasicAWSCredentials(
        settings.AccessKey,
        settings.SecretKey
    );

    var config = new AmazonS3Config
    {
        RegionEndpoint =
            RegionEndpoint.GetBySystemName(
                settings.Region
            )
    };  

    return new AmazonS3Client(
        credentials,
        config
    );
});

builder.Services.AddScoped<IUserRepositoryInterface, UserRepository>();
builder.Services.AddScoped<IUserServiceInterface, UserService>();

//Transaction
builder.Services.AddScoped<ITransactionRepositoryInterface, TransactionRepository>();
builder.Services.AddScoped<ITransactionServiceInterface, TransactionService>();

// Account
builder.Services.AddScoped<IAccountRepositoryInterface, AccountRepository>();
builder.Services.AddScoped<IAccountServiceInterface, AccountService>();

// Category
builder.Services.AddScoped<ICategoryRepositoryInterface, CategoryRepository>();
builder.Services.AddScoped<ICategoryServiceInterface, CategoryService>();

// Goal
builder.Services.AddScoped<IGoalRepositoryInterface, GoalRepository>();
builder.Services.AddScoped<IGoalServiceInterface, GoalService>();

// AI
builder.Services.AddScoped<IAIServiceInterface, AIService>();

// Token for JWT
builder.Services.AddScoped<ITokenServiceInterface, TokenService>();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
                      });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
