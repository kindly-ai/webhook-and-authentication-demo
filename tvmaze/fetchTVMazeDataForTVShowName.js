export default async (name) => {
  const response = await fetch(`https://api.tvmaze.com/search/shows?q=${name}`);
  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error("No data found");
  }
  return {
    name: data[0].show.name,
    summary: data[0].show.summary,
    rating: data[0].show.rating.average,
    genre: data[0].show.genres[0],
    image: data[0].show.image.original,
  };
};
