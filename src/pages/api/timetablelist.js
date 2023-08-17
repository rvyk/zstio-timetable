export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.TIMETABLE_URL}/lista.html`);
    const data = await response.text();
    if (response.status != 200) {
      return res.status(500).send("An error occurred");
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
}
