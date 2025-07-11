namespace TestAGit.Models;
public class CreatePlanDto
{
    public long id { get; set; }
    public string dateFrom { get; set; }
    public string dateTo { get; set; }
    public string createBy { get; set; }
    public int senin { get; set; }
    public int selasa { get; set; }
    public int rabu { get; set; }
    public int kamis { get; set; }
    public int jumat { get; set; }
    public int sabtu { get; set; }
    public int minggu { get; set; }
    public int status {get;set;}
}
