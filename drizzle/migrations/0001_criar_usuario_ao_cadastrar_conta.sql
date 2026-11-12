CREATE FUNCTION public.criar_usuario_ao_cadastrar_conta()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuario (id_usuario, nome, email, cargo)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data ->> 'nome'), ''), split_part(NEW.email, '@', 1)),
    NEW.email,
    NULLIF(btrim(NEW.raw_user_meta_data ->> 'cargo'), '')
  );
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.criar_usuario_ao_cadastrar_conta() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER criar_usuario_ao_cadastrar_conta
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.criar_usuario_ao_cadastrar_conta();