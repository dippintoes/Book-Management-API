//Requirement
//We need build an API to handle publications
// Book : ISBN, Title, Author[], Language, Pub date, No of pages, Category[];

//Authors 
//Name, ID, Books[];

//Publications
//Name, ID, Books[];

//================================================================================================================

//We need an API

//GET
//to get all books
//to get specific book
//to get list of book based on category
//to get list of book based on author

/*
Post
upload a new book

Put
updating book details
adding new author

Delete
delete a book
delete a author from book

*/


//============================================================================================================

//We need an API

//GET
//to get all auhtors
//to get specific author
//to get a list of authors based on a book

/*
Post
New author

Put
updating author name using id

Delete
delete a author

*/


//==================================================================================================================

//We need an API

//GET
//to get all publications
//to get specific publication
//to get a list of publications based on a book

/*
Post
add new publication

Put
updating publication name using id
update/add a new book to the publication

Delete
delete publication
delete a publication from books and publication too
*/

//====================================================================================================================
/*
MongoDB Operators -> powerfull yet we dont use it much
to avoid using map , filter and replace array and all that..

Instead we use mongoDB operators:

simple operators:
[ 
    update operators:
    $ is necessary for mongoDB to know that we are using operator
    LOGICAL
    $inc -> increment -> -1 to decrement by 1 as it dont have decrement operator
    $min -> minimum 
    $max -> maximum
    $set -> sets a data to an object property
    book.title = "hello";
    $unset -> removes a property from an object
    book = {
        title = "hello"
    };if you dont want this key or to delete this property we use unset


    ARRAYS
    $push
    $pop
    $pull -> ["a","b","c"] if you want extract a, then just say name: "a" or  $pull:{name: a};  This is similar to filter i.e. to remove any array
    $addToSet  ->when you push a data and you dont want duplicate entries for eg. [1,2,1,2], if you dont want duplicates addToSet which nothing but push and clever to check to if data already exist already dont push

*/