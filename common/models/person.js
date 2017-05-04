'use strict';

module.exports = function(Person) {

  Person.observe('before delete', function (context, next) {

    var relation = Person.app.models.relation;

    console.log(context.where.id);

    relation.find({}, function(err, relationSearchResult){

      relationSearchResult.forEach(function(rel){
        if (rel.personAId.toString() == context.where.id ||
            rel.personBId.toString() == context.where.id) {
          rel.destroy();
        }
      });

      next();

    });

  });
};
