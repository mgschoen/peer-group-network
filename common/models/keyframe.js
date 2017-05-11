'use strict';

module.exports = function(Keyframe) {

  Keyframe.observe('before save', function (context, next){

    if (!context.instance.time && typeof context.instance.time !== 'string') {
      next(new Error('Instance must have component `time` as ISO formatted Date string'));
      return;
    }

    var newYear = new Date(context.instance.time).getFullYear();

    Keyframe.find({}, function(err, existingKeyframes) {

      if (err) throw err;

      for (var i=0; i<existingKeyframes.length; i++) {
        var kf = existingKeyframes[i];
        if (kf.time.getFullYear() == newYear) {
          next(new Error('Keyframe for year '+newYear+' already exists'));
          return;
        }
      }

      next();

    });
  });

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
