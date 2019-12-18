describe('Wick.Tools.Text', function() {
    it('should activate without errors', function() {
        var project = new Wick.Project();
        project.tools.text.activate();
    });

    it('should create text items correctly', function() {
        var project = new Wick.Project();
        var text = project.tools.text;
        text.activate();

        project.toolSettings.setSetting('fillColor', new Wick.Color('#ff0000'));

        text.onMouseMove({point: new paper.Point(50,50), modifiers: {}});
        text.onMouseDown({point: new paper.Point(50,50), modifiers: {}});
        text.onMouseUp({point: new paper.Point(50,50), modifiers: {}});

        expect(project.activeFrame.paths.length).to.equal(1);
        expect(project.activeFrame.paths[0].fillColor.toCSS(true)).to.equal('#ff0000');
        expect(project.activeFrame.paths[0].editMode).to.equal(true);
    });
});
