using Core;
using Microsoft.EntityFrameworkCore;
using System;
//using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;

namespace Database;

/// <summary>
/// Repository provider for Entity Framework
/// </summary>
public class EFRepository : Repository
{
    private readonly EfDbContext _context;

    public EFRepository(EfDbContext context)
    {
        _context = context;
    }

    public IQueryable<T> All<T>(string[] includes = null) where T : class
    {
        //HANDLE INCLUDES FOR ASSOCIATED OBJECTS IF APPLICABLE
        if (includes != null && includes.Any())
        {
            var query = _context.Set<T>().Include(includes.First());
            query = includes.Skip(1).Aggregate(query, (current, include) => current.Include(include));
            return query.AsQueryable();
        }
        return _context.Set<T>().AsQueryable();
    }

    public T Get<T>(Guid id, params Expression<Func<T, object>>[] includes) where T : class, Identifier
    {
        IQueryable<T> query = _context.Set<T>();
        query = includes.Aggregate(query, (current, selector) => current.Include(selector));
        return query.FirstOrDefault(p => p.Id == id);
    }

    public T Get<T>(Expression<Func<T, bool>> expression, string[] includes = null) where T : class
    {
        return All<T>(includes).FirstOrDefault(expression);
    }

    //TODO: Revisit ApiController Get Includes and consider removing this
    public virtual T Find<T>(Expression<Func<T, bool>> predicate, string[] includes = null) where T : class
    {
        if (includes != null && includes.Any())
        {
            var query = _context.Set<T>().Include(includes.First());
            query = includes.Skip(1).Aggregate(query, (current, include) => current.Include(include));
            return query.FirstOrDefault<T>(predicate);
        }
        return _context.Set<T>().FirstOrDefault<T>(predicate);
    }

    //public T Find2<T>() where T : class
    //{
    //    _context.Set<Equipment>().Join
    //}

    public virtual T Find<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties) where T : class
    {
        IQueryable<T> query = _context.Set<T>();
        query = includeProperties.Aggregate(query, (current, selector) => current.Include(selector));
        return query.FirstOrDefault(predicate);
    }

    public virtual IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes) where T : class
    {
        if (includes != null && includes.Count() > 0)
        {
            var query = _context.Set<T>().Include(includes.First());
            foreach (var include in includes.Skip(1))
                query = query.Include(include);
            return query.Where(predicate).AsQueryable();
        }
        return _context.Set<T>().Where<T>(predicate).AsQueryable<T>();
    }

    public virtual IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, string[] includes = null) where T : class
    {
        if (includes != null && includes.Count() > 0)
        {
            var query = _context.Set<T>().Include(includes.First());
            foreach (var include in includes.Skip(1))
                query = query.Include(include);
            return query.Where(predicate).AsQueryable();
        }
        return _context.Set<T>().Where<T>(predicate).AsQueryable<T>();
    }

    public virtual IQueryable<T> FilterSort<T>(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "") where T : class
    {
        IQueryable<T> query = _context.Set<T>();
        if (filter != null)
            query = query.Where(filter);
        query = includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
            .Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
        return orderBy != null ? orderBy(query) : query;
    }

    public virtual IQueryable<T> FilterSort<T>(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, params Expression<Func<T, object>>[] includeProperties) where T : class
    {
        IQueryable<T> query = _context.Set<T>();
        if (filter != null)
            query = query.Where(filter);
        query = includeProperties.Aggregate(query, (current, selector) => current.Include(selector));
        return orderBy != null ? orderBy(query) : query;
    }

    public virtual IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, out int total, int index = 0, int size = 50, string[] includes = null) where T : class
    {
        int skipCount = index * size;
        IQueryable<T> _resetSet;
        //HANDLE INCLUDES FOR ASSOCIATED OBJECTS IF APPLICABLE
        if (includes != null && includes.Any())
        {
            var query = _context.Set<T>().Include(includes.First());
            query = includes.Skip(1).Aggregate(query, (current, include) => current.Include(include));
            _resetSet = predicate != null ? query.Where<T>(predicate).AsQueryable() : query.AsQueryable();
        }
        else
        {
            _resetSet = predicate != null
                ? _context.Set<T>().Where<T>(predicate).AsQueryable()
                : _context.Set<T>().AsQueryable();
        }
        _resetSet = skipCount == 0 ? _resetSet.Take(size) : _resetSet.Skip(skipCount).Take(size);
        total = _resetSet.Count();
        return _resetSet.AsQueryable();
    }

    public virtual int Count<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        return _context.Set<T>().Count(predicate);
    }

    public virtual T Create<T>(T TObject) where T : class
    {
        //ADD CREATE DATE IF APPLICABLE
        if (TObject is CreatedOn)
        {
            (TObject as CreatedOn).CreatedOn = DateTime.Now;
        }
        //ADD LAST MODIFIED DATE IF APPLICABLE
        if (TObject is ModifiedOn)
        {
            (TObject as ModifiedOn).ModifiedOn = DateTime.Now;
        }
        var newEntry = _context.Set<T>().Add(TObject);
        _context.SaveChanges();
        return newEntry.Entity;
    }

    public virtual int Delete<T>(T TObject) where T : class
    {
        _context.Set<T>().Remove(TObject);
        return _context.SaveChanges();
    }

    // Update all table columns
    public virtual int Update<T>(T TObject) where T : class
    {
        //ADD LAST MODIFIED DATE IF APPLICABLE
        if (TObject is ModifiedOn)
            (TObject as ModifiedOn).ModifiedOn = DateTime.Now;

        var entry = _context.Entry(TObject);
        _context.Set<T>().Attach(TObject);
        entry.State = EntityState.Modified;
        return _context.SaveChanges();
    }

    // Update table columns provided
    //TODO: Change int id to object id a KeyValues object, and use Find(object id)
    public virtual T Update<T>(Guid id, params Func<T, object>[] properties) where T : class, Identifier
    {
        //var obj = dbContext.Set<T>().Find(id)
        var obj = Find<T>(q => q.Id == id);
        _context.Set<T>().Attach(obj);
        foreach (var lambda in properties)
            lambda.Invoke(obj);
        _context.SaveChanges();
        return obj;
    }

    // Update table columns provided
    public virtual T Update<T>(Expression<Func<T, bool>> predicate, params Func<T, object>[] properties) where T : class
    {
        var obj = Find(predicate);
        _context.Set<T>().Attach(obj);
        foreach (var lambda in properties)
            lambda.Invoke(obj);
        _context.SaveChanges();
        return obj;
    }

    public virtual int Delete<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        var objects = Filter(predicate);
        foreach (var obj in objects)
            _context.Set<T>().Remove(obj);
        return _context.SaveChanges();
    }

    public virtual int Delete<T>(object id) where T : class
    {
        var entityToDelete = _context.Set<T>().Find(id);
        return Delete(entityToDelete);
    }

    public bool Contains<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        return _context.Set<T>().Count<T>(predicate) > 0;
    }

    //public virtual IQueryable<T> SelectQuery<T>(string query, params object[] parameters) where T : class
    //{
    //    return _context.Set<T>().SqlQuery(query, parameters).AsQueryable();
    //}

    //public virtual void ExecuteCommand(String procedureCommand, params SqlParameter[] sqlParams)
    //{
    //    _context.Database.ExecuteSqlCommand(procedureCommand, sqlParams);
    //}
}
