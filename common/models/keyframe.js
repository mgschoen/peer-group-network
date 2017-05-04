'use strict';

module.exports = function(Keyframe) {

  Keyframe.observe('before delete', function (context, next) {

    var relation = Keyframe.app.models.relation;

    relation.destroyAll(
      {keyframeId: context.where.id},
      function(err, destroyRelationsResult){
        console.log(destroyRelationsResult);
        next();
      });
  });

};
