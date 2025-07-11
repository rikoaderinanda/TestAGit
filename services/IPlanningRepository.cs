using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using TestAGit.Models;
using Dapper;

namespace TestAGit.Services
{
    public interface IPlanningRepository
    {
        Task<IEnumerable<dynamic>> GetAllAsync(string Filter);
        Task<IEnumerable<dynamic>> GetPlanningById(string Id);
        Task CreateNewPlan(CreatePlanDto planData);
        Task UpdatePlan(CreatePlanDto planData);
        Task Approval(string id,int status);   
    }
    public class PlanningRepository : IPlanningRepository
    {
        private readonly IDbConnection _db;

        public PlanningRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<dynamic>> GetAllAsync(string Filter)
        {
            var sql = "SELECT * FROM TaskLog WHERE status = @Filter";
            return await _db.QueryAsync<dynamic>(sql, new { Filter });
        }

        public async Task<IEnumerable<dynamic>> GetPlanningById(string Id)
        {
            var sql = "SELECT * FROM TaskLog WHERE Id = @Id";
            return await _db.QueryAsync<dynamic>(sql, new { Id });
        }

        public async Task CreateNewPlan(CreatePlanDto planData)
        {
            var sql = "INSERT INTO TaskLog (StartDate,LastDate,CreateBy,CreateDate,Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu,Status) " +
                      "VALUES (@dateFrom, @dateTo,@createBy,GETDATE(), @senin, @selasa, @rabu,@kamis,@jumat,@sabtu,@minggu,@status)";
            await _db.ExecuteAsync(sql, new
            {
                dateFrom = planData.dateFrom,
                dateTo = planData.dateTo,
                createBy = planData.createBy,
                senin = planData.senin,
                selasa = planData.selasa,
                rabu = planData.rabu,
                kamis = planData.kamis,
                jumat = planData.jumat,
                sabtu = planData.sabtu,
                minggu = planData.minggu,
                status = planData.status
            });
        }   

        public async Task UpdatePlan(CreatePlanDto planData)
        {
            var sql = "UPDATE TaskLog SET StartDate = @dateFrom, LastDate = @dateTo, " +
                      "Senin = @senin, Selasa = @selasa, Rabu = @rabu, " +
                      "Kamis = @kamis, Jumat = @jumat, Sabtu = @sabtu, " +
                      "Minggu = @minggu, Status = @status " +
                      "WHERE id = @id";
            await _db.ExecuteAsync(sql, new
            {
                id = planData.id,
                dateFrom = planData.dateFrom,
                dateTo = planData.dateTo,
                createBy = planData.createBy,
                senin = planData.senin,
                selasa = planData.selasa,
                rabu = planData.rabu,
                kamis = planData.kamis,
                jumat = planData.jumat,
                sabtu = planData.sabtu,
                minggu = planData.minggu,
                status = planData.status
            });
        }   

        public async Task Approval(string id,int status)
        {
            var sql = "UPDATE TaskLog SET status = "+status+", approved_by = 'Bos', approved_at = GETDATE() " +
                      "WHERE id = @Id";
            await _db.ExecuteAsync(sql, new
            {
                Id = id,
            });
        }   

    }
}