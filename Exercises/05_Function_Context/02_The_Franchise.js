let franchise = {
  name: 'How to Train Your Dragon',
  allMovies: function() {
    let self = this;
    return [1, 2, 3].map(function(number) {
      return this.name + ' ' + number;
    });
  },
};

console.log(franchise.allMovies());