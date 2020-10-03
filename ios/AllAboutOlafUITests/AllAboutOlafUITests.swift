//
//  All_About_Olaf_UI_Tests.swift
//  All About Olaf UI Tests
//
//  Created by Hawken Rives on 11/14/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import XCTest

class AllAboutOlafUITests: XCTestCase {
    var app = XCUIApplication()

    override func setUp() {
        super.setUp()
        // In UI tests it is usually best to stop immediately when a failure
        // occurs.
        continueAfterFailure = false

        // UI tests must launch the application that they test. Doing this in
        // setup will make sure it happens for each test method.
        setupSnapshot(app)
        app.launch()

        // In UI tests it’s important to set the initial state - such as
        // interface orientation - required for your tests before they run.
        // The setUp method is a good place to do this.
        XCUIDevice.shared().orientation = .portrait
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }

    func testMainMenuScreen() {
        sleep(1)
        snapshot("MainMenuScreen")
    }

    func testOpenMenusScreen() {
        app.buttons["Menus"].tap()
        sleep(3)
        snapshot("MenusScreenBurtonMenu")
    }

    func testOpenConvosScreen() {
        app.buttons["Convo"].tap()
        sleep(3)
        snapshot("ConvoScreen")
    }

    func testOpenBuildingHoursScreen() {
        app.buttons["Building Hours"].tap()
        sleep(2)
        snapshot("BuildingHoursScreen")
    }

    func testOpenCalendarScreen() {
        app.buttons["Calendar"].tap()
        sleep(5)
        snapshot("CalendarScreen")
    }

    func testOpenDirectoryScreen() {
        app.buttons["Stalkernet"].tap()
        sleep(5)
        snapshot("DirectoryScreen")
    }

    func testOpenRadioScreen() {
        app.buttons["KRLX"].tap()
        sleep(2)
        snapshot("RadioScreen")
    }

    func testOpenNewsScreen() {
        app.buttons["News"].tap()
        sleep(3)
        snapshot("NewsScreen")
    }

    func testOpenCampusMapScreen() {
        app.buttons["Campus Map"].tap()
                
        sleep(5)
        snapshot("CampusMapScreen")
    }

    func testOpenImportantContactsScreen() {
        app.buttons["Important Contacts"].tap()
        sleep(2)
        snapshot("ImportantContactsScreen")
    }

    func testOpenTransportationScreen() {
        app.buttons["Transportation"].tap()
        sleep(2)
        snapshot("TransportationScreen")
    }

    func testOpenCampusDictionaryScreen() {
        app.buttons["Dictionary"].tap()
        sleep(2)
        snapshot("CampusDictionaryScreen")
    }

    func testOpenStudentOrgsScreen() {
        app.buttons["Student Orgs"].tap()
        sleep(2)
        snapshot("StudentOrgsScreen")
    }
}
