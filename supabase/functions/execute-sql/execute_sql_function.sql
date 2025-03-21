
-- Create a function to execute SQL queries safely
CREATE OR REPLACE FUNCTION public.execute_sql(query_text text, query_params jsonb DEFAULT '[]'::jsonb)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
    user_role text;
    dynamic_sql text;
    param_value jsonb;
    i integer;
BEGIN
    -- Check if the user has admin privileges
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    
    IF user_role != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can execute custom SQL queries';
    END IF;
    
    -- Add security checks for the SQL query
    IF position('insert into auth.' in lower(query_text)) > 0 OR
       position('update auth.' in lower(query_text)) > 0 OR
       position('delete from auth.' in lower(query_text)) > 0 OR
       position('truncate' in lower(query_text)) > 0 OR
       position('drop ' in lower(query_text)) > 0 OR
       position('alter ' in lower(query_text)) > 0 OR
       position('grant ' in lower(query_text)) > 0 OR
       position('revoke ' in lower(query_text)) > 0 THEN
        RAISE EXCEPTION 'Unsafe SQL operation detected';
    END IF;
    
    -- Build dynamic SQL with proper parameter handling
    dynamic_sql := query_text;
    
    -- Handle parameters if provided
    IF query_params IS NOT NULL AND jsonb_array_length(query_params) > 0 THEN
        FOR i IN 0..jsonb_array_length(query_params) - 1 LOOP
            param_value := query_params -> i;
            -- Replace parameter placeholders with actual values
            dynamic_sql := regexp_replace(
                dynamic_sql, 
                '\$' || (i + 1),
                quote_literal(param_value #>> '{}'), 
                'g'
            );
        END LOOP;
    END IF;
    
    -- Execute the query and return results
    RETURN QUERY EXECUTE dynamic_sql;
EXCEPTION
    WHEN OTHERS THEN
        -- Return error information as JSON
        RETURN QUERY SELECT jsonb_build_object(
            'error', SQLERRM,
            'detail', SQLSTATE,
            'query', query_text
        );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
