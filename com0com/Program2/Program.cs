using System;
using System.IO.Ports;

public static class ComCommunication
{
    static string COM_name;
    static bool isOn = false;
    static SerialPort COMport;


    public static void startCommunication(string com_name, string nickname)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Ttring To Connect To Port " + com_name);
            COM_name = com_name;
            COMport = new SerialPort(com_name);
            //
            COMport.Open();
            //
            isOn = true;
            COMport.WriteLine(nickname);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Connection Established");
            Console.ForegroundColor = ConsoleColor.White;
            sendmesssage();
            COMport.Close();
        } catch
        {
            
        }
    }
    public static void startCommunication(string com_name, int baud_rate, string nickname)
    {
        try {
            Console.ForegroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("Ttring To Connect To Port " + com_name);
            COM_name = com_name;
            COMport = new SerialPort(com_name, baud_rate);
            COMport.Open();
            isOn = true;
            COMport.WriteLine(nickname);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Connection Established");
            Console.ForegroundColor = ConsoleColor.White;
            sendmesssage();
            COMport.Close();
        } catch
        {
            
        }
    }


    private static void sendmesssage()
    {
        string m;
        while (isOn)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Message: ");
            Console.ForegroundColor = ConsoleColor.White;
            m = Console.ReadLine() ?? "";
            COMport.WriteLine(m);
            if (m.ToLower() == "exit")
            {
                endConnection();
            }
        }
    }

    private static void endConnection()
    {
        COMport.Close();
        isOn = false;
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Connection closed with code 'exit'");
        Console.ForegroundColor = ConsoleColor.White;
    }
}



public class program2
{
    public static void Main()
    {
        Console.Write("Enter COM name: ");
        string portName = Console.ReadLine();
        Console.Write("Enter nickname: ");
        string nickname = Console.ReadLine();
        ComCommunication.startCommunication(portName, 10, nickname);
    }
}