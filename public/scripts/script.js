$(".dlt-btn").on("click", function (item) {
  if (confirm("Do you want to delete this post?")) {
    axios.delete(`/delete-post?${this.id}`);
  }
});
