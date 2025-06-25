-- Create a function to get car details with specs
CREATE OR REPLACE FUNCTION get_car_with_specs(car_id_param INTEGER)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  model TEXT,
  category TEXT,
  year TEXT,
  price TEXT,
  image TEXT,
  gallery TEXT[],
  description TEXT,
  featured BOOLEAN,
  color TEXT,
  specs JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.model,
    c.category,
    c.year,
    c.price,
    c.image,
    c.gallery,
    c.description,
    c.featured,
    c.color,
    jsonb_build_object(
      'speed', COALESCE(cs.speed, 'N/A'),
      'acceleration', COALESCE(cs.acceleration, 'N/A'),
      'power', COALESCE(cs.power, 'N/A'),
      'range', COALESCE(cs.range, 'N/A')
    ) AS specs
  FROM
    cars c
    LEFT JOIN car_specs cs ON c.id = cs.car_id
  WHERE
    c.id = car_id_param;
END;
$$ LANGUAGE plpgsql; 