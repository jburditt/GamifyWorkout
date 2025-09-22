using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api;

[Route("api/[controller]")]
[ApiController]
public class ScheduleController : ControllerBase
{
    private readonly IDbContextFactory<EfDbContext> _contextFactory;

    public ScheduleController(IDbContextFactory<EfDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    [HttpGet("{monday}")]
    [Produces("application/json")]
    public ActionResult<List<WeeklySchedule>> Get(DateOnly monday)
    {
        var context = _contextFactory.CreateDbContext();
        var schedules = context.Schedule
            // TODO get userId from Claims
            .Where(s => s.UserId == new Guid("113C9AA8-F4C3-4DE7-2FCE-08DDF89CDBF6") && s.Date >= monday && s.Date <= monday.AddDays(6))
            .OrderBy(s => s.Date)
            .ToList();

        var weeklySchedule = new WeeklySchedule(schedules);
        return Ok(weeklySchedule);
    }

    [HttpPost]
    [Produces("application/json")]
    public ActionResult<bool> Post([FromBody] WeeklySchedule weeklySchedule)
    {
        var context = _contextFactory.CreateDbContext();
        if (weeklySchedule.Monday != null) context.Schedule.Add(weeklySchedule.Monday);
        if (weeklySchedule.Tuesday != null) context.Schedule.Add(weeklySchedule.Tuesday);
        if (weeklySchedule.Wednesday != null) context.Schedule.Add(weeklySchedule.Wednesday);
        if (weeklySchedule.Thursday != null) context.Schedule.Add(weeklySchedule.Thursday);
        if (weeklySchedule.Friday != null) context.Schedule.Add(weeklySchedule.Friday);
        if (weeklySchedule.Saturday != null) context.Schedule.Add(weeklySchedule.Saturday);
        if (weeklySchedule.Sunday != null) context.Schedule.Add(weeklySchedule.Sunday);
        return Ok(context.SaveChanges() > 0);
    }
}

public class WeeklySchedule
{
    public Schedule? Monday { get; set; }
    public Schedule? Tuesday { get; set; }
    public Schedule? Wednesday { get; set; }
    public Schedule? Thursday { get; set; }
    public Schedule? Friday { get; set; }
    public Schedule? Saturday { get; set; }
    public Schedule? Sunday { get; set; }

    public WeeklySchedule(List<Schedule> schedules)
    {
        if (schedules == null || schedules.Count != 7)
            throw new ArgumentException("There should be exactly 7 schedules.");

        Monday = schedules[0];
        Tuesday = schedules[1];
        Wednesday = schedules[2];
        Thursday = schedules[3];
        Friday = schedules[4];
        Saturday = schedules[5];
        Sunday = schedules[6];
    }
}