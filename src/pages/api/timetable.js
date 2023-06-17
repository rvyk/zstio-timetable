export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const response = await fetch(
      `http://www.zstio-elektronika.pl/plan/plany/${id}.html`
    );
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
}
