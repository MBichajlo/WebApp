$(".dlt-btn").on("click", function (item) {
  axios.delete(`/delete-post?${this.id}`);
});
