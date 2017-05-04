'use strict';

module.exports = function(RelationType) {

  RelationType.observe('before delete', function (context, next) {

    var relation = RelationType.app.models.relation;

    relation.destroyAll(
      {relationTypeId: context.where.id},
      function(err, destroyRelationsResult){
        console.log(destroyRelationsResult);
        next();
      });
  });
};
