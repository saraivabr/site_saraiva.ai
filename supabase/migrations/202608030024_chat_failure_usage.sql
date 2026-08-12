create or replace function public.fail_chat_generation_with_usage(
  p_generation_run_id uuid,
  p_error_code text,
  p_provider_response_id text,
  p_input_tokens integer,
  p_output_tokens integer,
  p_estimated_cost_micros bigint,
  p_latency_ms integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.chat_generation_runs
  set status = 'failed',
      validation_result = 'failed',
      error_code = left(coalesce(nullif(btrim(p_error_code), ''), 'generation_failed'), 120),
      provider_response_id = nullif(btrim(p_provider_response_id), ''),
      input_tokens = greatest(coalesce(p_input_tokens, 0), 0),
      output_tokens = greatest(coalesce(p_output_tokens, 0), 0),
      estimated_cost_micros = greatest(coalesce(p_estimated_cost_micros, 0), 0),
      latency_ms = greatest(coalesce(p_latency_ms, 0), 0),
      completed_at = statement_timestamp()
  where id = p_generation_run_id and status = 'started';
end;
$$;
revoke all on function public.fail_chat_generation_with_usage(uuid, text, text, integer, integer, bigint, integer) from public;
revoke all on function public.fail_chat_generation_with_usage(uuid, text, text, integer, integer, bigint, integer) from anon;
revoke all on function public.fail_chat_generation_with_usage(uuid, text, text, integer, integer, bigint, integer) from authenticated;
grant execute on function public.fail_chat_generation_with_usage(uuid, text, text, integer, integer, bigint, integer) to service_role;
