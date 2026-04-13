export default async function handler(req, res) {
  try {
    const response = await fetch('https://preprod-api.javer.com.mx/about-us/', {
      cache: 'no-cache',
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch' });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}