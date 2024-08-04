package models

import (
    "testing"
    "github.com/stretchr/testify/require"
)


func TestDewPointTemperature(t *testing.T) {
    testWeather := Weather {
        Wind:                       Wind { Speed: 27, Direction: North, },
        Temperature:                Temperature { DegreesCelsius: 110, },
        AirHumidity:                AirHumidity { Percent: 70, },
        AtmosphericPrecipitation:   AtmosphericPrecipitation { Millimeters: 8, },
    }

    t.Log("Проверка правильности подсчёта влажности воздуха.")
    {
        testID := 0
        t.Logf("\tТест %d: \tЗначения, близкие к норме.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 22
            testWeather.AirHumidity.Percent = 57
            point, err := testWeather.DewPointTemperature()
            require.NoError(t, err)
            require.InDelta(t, point, 13.08, 0.01)
    

        }

        testID++
        t.Logf("\tТест %d: \tВысокая температура.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 46
            testWeather.AirHumidity.Percent = 57
            point, err := testWeather.DewPointTemperature()
            require.NoError(t, err)
            require.InDelta(t, point, 35.39, 0.01)
        }

        testID++
        t.Logf("\tТест %d: \tОчень высокая температура.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 138
            testWeather.AirHumidity.Percent = 40
            point, err := testWeather.DewPointTemperature()
            require.NoError(t, err)
            require.InDelta(t, point, 108.93, 0.01)
        }

        testID++
        t.Logf("\tТест %d: \tНизкая температура.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 7
            testWeather.AirHumidity.Percent = 43 
            point, err := testWeather.DewPointTemperature()
            require.NoError(t, err)
            require.InDelta(t, point, -4.72, 0.01)
        }

        testID++
        t.Logf("\tТест %d: \tТемпература ниже нуля.", testID)
        {
            testWeather.Temperature.DegreesCelsius = -15
            testWeather.AirHumidity.Percent = 43 
            _, err := testWeather.DewPointTemperature()
            require.Error(t, err)
        }

        testID++
        t.Logf("\tТест %d: \tВлажность выше 100%%.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 10
            testWeather.AirHumidity.Percent = 101
            _, err := testWeather.DewPointTemperature()
            require.Error(t, err)
        }

        testID++
        t.Logf("\tТест %d: \tНулевая влажность.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 7
            testWeather.AirHumidity.Percent = 0 
            _, err := testWeather.DewPointTemperature()
            require.Error(t, err)
        }

        testID++
        t.Logf("\tТест %d: \tВлажность 100%%.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 7
            testWeather.AirHumidity.Percent = 100 
            point, err := testWeather.DewPointTemperature()
            require.NoError(t, err)
            require.InDelta(t, point, 7, 0.01)
        }

        testID++
        t.Logf("\tТекст %d: \tОтрицательная влажность.", testID)
        {
            testWeather.Temperature.DegreesCelsius = 7
            testWeather.AirHumidity.Percent = -14 
            _, err := testWeather.DewPointTemperature()
            require.Error(t, err)
        }
    }
}


