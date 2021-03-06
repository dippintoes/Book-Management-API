let books = [
    {
      ISBN: "12345Book",
      title: "Getting started with MERN",
      pubDate: "2021-07-07",
      language: "en",
      numPage: 250,
      author: ["1", "2"],
      publications: ["1"],
      category: ["tech", "programming", "education", "must-read"],
    },
    {
        ISBN: "12345Second",
        title: "Pride and Prejudice",
        pubDate: "2021-07-12",
        language: "en",
        numPage: 300,
        author: ["1"],
        publications: ["2"],
        category: ["Romance", "programming", "education", "must-read"],
      }
  ];
  
  let author = [
    {
      id: "1",
      name: "Rutuja Gosavi",
      books: ["12345Book", "12345Second"],
    },
    { 
        id: "2", 
        name: "Elon Musk", 
        books: ["12345Book"] 
    }
  ];
  
  let publication = [
    {
      id: "1",
      name: "Penguin",
      books: ["12345Book"],
    },
    {
      id: "2",
      name: "SoulReaders",
      books: ["12345Second"],
    }
  ];

  // module is this file and we export it so, that we can use it where needed ans stored information
  module.exports = {books, author, publication};


  //HTTP client(helper) ---> Postman - to manage api's, to send request, to write auto documentation

  //model is document model of mongoDB
  //How does this model know which documnet to use?
  //----> use document name from mongoDB

  //you can have single file for all schamas but it's just not a good practise, so maintain separate file for one single file
//you need to use async and await to extract information using mongoose because it is asynchrounous.. otherwise, it will give some javascript circular object error, something like that